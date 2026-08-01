/**
 * Escape a regex string.
 *
 * @param {string} value Raw string.
 * @return {string} Escaped string.
 */
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Convert a static theme/plugin image URL into a dynamic PHP URI expression.
 *
 * @param {string} src Image src value.
 * @param {Object} options Options.
 * @param {string} options.uriPhpExpression PHP expression inside esc_url().
 * @param {string[]} [options.imagePathRoots] Path roots under the product (e.g. assets).
 * @param {boolean} [options.debug] Log matches.
 * @return {string} Original or rewritten src.
 */
function escapeImagePath(src, options = {}) {
	const {
		uriPhpExpression = 'get_template_directory_uri()',
		imagePathRoots = ['assets', 'patterns/images'],
		debug = false,
	} = options;

	if (!src || src.trim().startsWith('<?php')) {
		return src;
	}

	const phpUri = `<?php echo esc_url( ${uriPhpExpression} ); ?>`;

	for (const root of imagePathRoots) {
		const rootPattern = escapeRegExp(root);
		const absoluteRe = new RegExp(
			`https?:\\/\\/[^"'\\s]+?\\/(${rootPattern}\\/[^"'\\s]+)`,
			'i'
		);
		const absoluteMatch = src.match(absoluteRe);

		if (absoluteMatch) {
			if (debug) {
				// @debug-ignore — CLI debug output for patterns:localize --debug
				// eslint-disable-next-line no-console
				console.log(
					'Image absolute match:',
					absoluteMatch[0],
					'->',
					absoluteMatch[1]
				);
			}
			return `${phpUri}/${absoluteMatch[1]}`;
		}
	}

	for (const root of imagePathRoots) {
		const parts = src.split('/');
		const rootParts = root.split('/');

		for (let i = 0; i <= parts.length - rootParts.length; i++) {
			const matchesRoot = rootParts.every(
				(segment, index) => parts[i + index] === segment
			);

			if (!matchesRoot) {
				continue;
			}

			const resultSrc = parts.slice(i).join('/');

			if (debug) {
				// @debug-ignore — CLI debug output for patterns:localize --debug
				// eslint-disable-next-line no-console
				console.log('Image path-root match:', src, '->', resultSrc);
			}

			return `${phpUri}/${resultSrc}`;
		}
	}

	return src;
}

/**
 * Whether content still has absolute URLs pointing at configured image roots.
 *
 * @param {string} content File contents.
 * @param {string[]} [imagePathRoots] Path roots to detect.
 * @return {boolean} True when static absolute image URLs remain.
 */
function hasStaticImagePaths(
	content,
	imagePathRoots = ['assets', 'patterns/images']
) {
	for (const root of imagePathRoots) {
		const rootPattern = escapeRegExp(root);
		const srcRe = new RegExp(
			`src="https?:\\/\\/[^"]+\\/${rootPattern}\\/[^"]+"`,
			'i'
		);
		const urlRe = new RegExp(
			`"url"\\s*:\\s*"https?:\\/\\/[^"]+\\/${rootPattern}\\/[^"]+"`,
			'i'
		);

		if (srcRe.test(content) || urlRe.test(content)) {
			return true;
		}
	}

	return false;
}

module.exports = {
	escapeImagePath,
	hasStaticImagePaths,
	escapeRegExp,
};
