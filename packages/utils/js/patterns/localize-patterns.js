/**
 * Localize WordPress block pattern PHP files:
 * - wrap user-facing strings in esc_html_e / esc_attr_e
 * - rewrite absolute theme/plugin image URLs to a configurable PHP URI expression
 */

const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const fg = require('fast-glob');
// v6 is CommonJS (Jest/Node friendly); v7+ is ESM-only.
const RewritingStream = require('parse5-html-rewriting-stream');

/**
 * Internal dependencies
 */
const { escapeText } = require('./escape-text');
const {
	escapeImagePath,
	hasStaticImagePaths,
	escapeRegExp,
} = require('./escape-image-path');
const { escapeBlockAttrs } = require('./escape-block-attrs');

const DEFAULT_IMAGE_PATH_ROOTS = ['assets', 'patterns/images'];

/**
 * @typedef {Object} LocalizePatternsOptions
 * @property {string|string[]} [patternsDirs] Absolute path(s) to pattern directories.
 * @property {string|string[]} [patternsDir] Legacy alias for patternsDirs.
 * @property {string} textDomain Text domain for i18n calls.
 * @property {string} [uriPhpExpression] PHP expression passed to esc_url().
 * @property {string[]} [imagePathRoots] Product-relative image path roots.
 * @property {boolean} [force] Process even when already localized.
 * @property {boolean} [quiet] Suppress logs.
 * @property {boolean} [debug] Verbose image logging.
 * @property {boolean} [check] Do not write; report files that would change.
 */

/**
 * Normalize patternsDir / patternsDirs into an absolute path array.
 *
 * @param {LocalizePatternsOptions} options Localize options.
 * @return {string[]} Absolute pattern directory paths.
 */
function normalizePatternsDirs(options = {}) {
	const raw = options.patternsDirs ?? options.patternsDir;

	if (!raw) {
		return [];
	}

	if (Array.isArray(raw)) {
		return raw.filter(Boolean);
	}

	return [raw];
}

/**
 * Whether a patterns directory (or list of dirs) contains at least one PHP file.
 *
 * @param {string|string[]} patternsDir Absolute patterns directory or list.
 * @return {boolean} True when PHP pattern files exist in any directory.
 */
function hasPatternPhpFiles(patternsDir) {
	const dirs = Array.isArray(patternsDir) ? patternsDir : [patternsDir];

	for (const dir of dirs) {
		if (!dir || !fs.existsSync(dir)) {
			continue;
		}

		const matches = fg.sync('**/*.php', {
			cwd: dir,
			onlyFiles: true,
			absolute: false,
		});

		if (matches.length > 0) {
			return true;
		}
	}

	return false;
}

/**
 * Whether content still needs translation wrappers for the given text domain.
 *
 * @param {string} content File contents.
 * @param {string} textDomain Text domain.
 * @return {boolean} True when localization is needed.
 */
function needsTranslation(content, textDomain) {
	return !content.includes('<?php') || !content.includes(`'${textDomain}'`);
}

/**
 * Build a parse5 rewriting stream configured for pattern localization.
 *
 * @param {LocalizePatternsOptions} options Localize options.
 * @return {import('stream').Transform} Configured rewriter.
 */
function createRewriter(options) {
	const {
		textDomain,
		uriPhpExpression = 'get_template_directory_uri()',
		imagePathRoots = DEFAULT_IMAGE_PATH_ROOTS,
		debug = false,
	} = options;

	const rewriter = new RewritingStream();
	const imageOptions = { uriPhpExpression, imagePathRoots, debug };

	rewriter.on('text', (_, raw) => {
		rewriter.emitRaw(escapeText(raw, textDomain));
	});

	rewriter.on('startTag', (startTag) => {
		if (startTag.tagName === 'img') {
			const srcAttr = startTag.attrs.find((attr) => attr.name === 'src');
			if (srcAttr) {
				const originalSrc = srcAttr.value;
				const newSrc = escapeImagePath(originalSrc, imageOptions);

				if (debug) {
					// @debug-ignore — CLI debug output for patterns:localize --debug
					// eslint-disable-next-line no-console
					console.log('Processing image src:', {
						originalSrc,
						newSrc,
						changed: originalSrc !== newSrc,
					});
				}

				srcAttr.value = newSrc;
			}

			const altAttr = startTag.attrs.find((attr) => attr.name === 'alt');
			if (altAttr) {
				altAttr.value = escapeText(altAttr.value, textDomain, true);
			}
		}

		const ariaLabel = startTag.attrs.find(
			(attr) => attr.name === 'aria-label'
		);
		if (ariaLabel) {
			ariaLabel.value = escapeText(ariaLabel.value, textDomain, true);
		}

		rewriter.emitStartTag(startTag);
	});

	rewriter.on('comment', (comment, rawHtml) => {
		if (comment.text.startsWith('?php')) {
			rewriter.emitRaw(rawHtml);
			return;
		}

		let processedComment = comment.text;
		const rootsAlternation = imagePathRoots
			.map((root) => escapeRegExp(root))
			.join('|');

		const urlRegex = new RegExp(
			`("url"\\s*:\\s*")https?:\\/\\/[^"]+(\\/(?:${rootsAlternation})\\/[^"]+)(")`,
			'g'
		);

		processedComment = processedComment.replace(
			urlRegex,
			(match, prefix, imagePath, suffix) =>
				`${prefix}<?php echo esc_url( ${uriPhpExpression} ); ?>${imagePath}${suffix}`
		);

		const block = escapeBlockAttrs(processedComment, textDomain);
		rewriter.emitComment({ ...comment, text: block });
	});

	return rewriter;
}

/**
 * Transform pattern file content in memory.
 *
 * @param {string} content Original file contents.
 * @param {LocalizePatternsOptions} options Localize options.
 * @return {Promise<string>} Transformed contents.
 */
function localizePatternContent(content, options) {
	return new Promise((resolve, reject) => {
		const rewriter = createRewriter(options);
		const chunks = [];

		rewriter.on('data', (chunk) => {
			chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
		});
		rewriter.on('end', () => {
			resolve(Buffer.concat(chunks).toString('utf8'));
		});
		rewriter.on('error', reject);

		Readable.from([content]).pipe(rewriter);
	});
}

/**
 * Resolve the list of PHP pattern files under patternsDir.
 *
 * @param {string} patternsDir Absolute patterns directory.
 * @return {Promise<string[]>} Absolute file paths.
 */
async function listPatternFiles(patternsDir) {
	const files = await fg('**/*.php', {
		cwd: patternsDir,
		onlyFiles: true,
		absolute: true,
	});

	return files.sort();
}

/**
 * Localize all pattern PHP files under one directory.
 *
 * @param {string} patternsDir Absolute patterns directory.
 * @param {Object} shared Shared localize options (without patternsDir).
 * @return {Promise<string[]>} Changed absolute file paths.
 */
async function localizePatternsInDirectory(patternsDir, shared) {
	const {
		textDomain,
		uriPhpExpression = 'get_template_directory_uri()',
		imagePathRoots = DEFAULT_IMAGE_PATH_ROOTS,
		force = false,
		quiet = false,
		debug = false,
		check = false,
	} = shared;

	if (!hasPatternPhpFiles(patternsDir)) {
		if (!quiet) {
			// @debug-ignore — CLI status output for patterns:localize
			// eslint-disable-next-line no-console
			console.log(
				`No PHP pattern files found in ${patternsDir}; skipping.`
			);
		}

		return [];
	}

	const files = await listPatternFiles(patternsDir);
	const changedFiles = [];
	const runtimeOptions = {
		patternsDir,
		textDomain,
		uriPhpExpression,
		imagePathRoots,
		force,
		quiet,
		debug,
	};

	if (!quiet) {
		// @debug-ignore — CLI status output for patterns:localize
		// eslint-disable-next-line no-console
		console.log(
			`Processing ${files.length} pattern file(s) in ${patternsDir} with text domain "${textDomain}"...`
		);
	}

	for (const file of files) {
		const relative = path.relative(patternsDir, file);

		if (!quiet) {
			// @debug-ignore — CLI status output for patterns:localize
			// eslint-disable-next-line no-console
			console.log(`  - ${relative}`);
		}

		const originalContent = await fs.promises.readFile(file, 'utf8');

		if (debug) {
			const imgMatches = [...originalContent.matchAll(/src="([^"]+)"/g)];
			// @debug-ignore — CLI debug output for patterns:localize --debug
			// eslint-disable-next-line no-console
			console.log('Found image src attributes:');
			imgMatches.forEach((match) => {
				// @debug-ignore — CLI debug output for patterns:localize --debug
				// eslint-disable-next-line no-console
				console.log(`  - ${match[1]}`);
			});
		}

		const needsI18n = needsTranslation(originalContent, textDomain);
		const hasStaticImages = hasStaticImagePaths(
			originalContent,
			imagePathRoots
		);

		if (!needsI18n && !hasStaticImages && !force) {
			if (!quiet) {
				// @debug-ignore — CLI status output for patterns:localize
				// eslint-disable-next-line no-console
				console.log(
					'    - Already has translations and dynamic image paths, skipping'
				);
			}
			continue;
		}

		if (hasStaticImages && !quiet) {
			// @debug-ignore — CLI status output for patterns:localize
			// eslint-disable-next-line no-console
			console.log('    - Found static image paths to update');
		}

		const nextContent = await localizePatternContent(
			originalContent,
			runtimeOptions
		);

		if (nextContent === originalContent) {
			if (!quiet) {
				// @debug-ignore — CLI status output for patterns:localize
				// eslint-disable-next-line no-console
				console.log('    - No content changes after transform');
			}
			continue;
		}

		changedFiles.push(file);

		if (!check) {
			await fs.promises.writeFile(file, nextContent, 'utf8');
		}
	}

	return changedFiles;
}

/**
 * Localize all pattern PHP files under options.patternsDirs / patternsDir.
 *
 * @param {LocalizePatternsOptions} options Localize options.
 * @return {Promise<{ changedFiles: string[], ok: boolean, reason?: string }>} Result.
 */
async function localizePatterns(options = {}) {
	const patternsDirs = normalizePatternsDirs(options);

	if (!patternsDirs.length) {
		throw new Error(
			'localizePatterns: patternsDirs (or patternsDir) is required.'
		);
	}

	if (!options.textDomain) {
		throw new Error('localizePatterns: textDomain is required.');
	}

	const {
		textDomain,
		uriPhpExpression = 'get_template_directory_uri()',
		imagePathRoots = DEFAULT_IMAGE_PATH_ROOTS,
		force = false,
		quiet = false,
		debug = false,
		check = false,
	} = options;

	const shared = {
		textDomain,
		uriPhpExpression,
		imagePathRoots,
		force,
		quiet,
		debug,
		check,
	};

	const changedFiles = [];

	for (const patternsDir of patternsDirs) {
		const changed = await localizePatternsInDirectory(patternsDir, shared);
		for (const file of changed) {
			changedFiles.push(file);
		}
	}

	if (check && changedFiles.length > 0) {
		return {
			changedFiles,
			ok: false,
			reason: `${changedFiles.length} pattern file(s) need localization.`,
		};
	}

	return { changedFiles, ok: true };
}

/**
 * Check that patterns are already localized (no writes).
 *
 * @param {LocalizePatternsOptions} options Localize options (check forced on).
 * @return {Promise<{ changedFiles: string[], ok: boolean, reason?: string }>} Result.
 */
async function checkPatterns(options = {}) {
	return localizePatterns({ ...options, check: true });
}

module.exports = {
	DEFAULT_IMAGE_PATH_ROOTS,
	normalizePatternsDirs,
	hasPatternPhpFiles,
	needsTranslation,
	localizePatternContent,
	localizePatterns,
	checkPatterns,
	escapeText,
	escapeImagePath,
	escapeBlockAttrs,
	hasStaticImagePaths,
};
