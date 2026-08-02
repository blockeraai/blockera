/**
 * Load theme-root `.patterns.config.js` and normalize options for localize core.
 */

const fs = require('fs');
const path = require('path');

const PRODUCT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const CONFIG_FILE_NAME = '.patterns.config.js';

/**
 * @typedef {Object} PatternsConfig
 * @property {string} textDomain Text domain.
 * @property {string} uriPhpExpression PHP expression for esc_url().
 * @property {string[]} [imagePathRoots] Image path roots.
 * @property {string|string[]} [patternsDirs] Patterns dir(s) relative to product root.
 * @property {string|string[]} [patternsDir] Legacy alias for patternsDirs.
 */

/**
 * Resolve the product root (theme/plugin root).
 *
 * @return {string} Absolute product root.
 */
function getProductRoot() {
	return PRODUCT_ROOT;
}

/**
 * Absolute path to `.patterns.config.js`.
 *
 * @param {string} [productRoot] Product root override.
 * @return {string} Config file path.
 */
function getPatternsConfigPath(productRoot = PRODUCT_ROOT) {
	return path.join(productRoot, CONFIG_FILE_NAME);
}

/**
 * Normalize patternsDir / patternsDirs config into a string[].
 *
 * @param {string|string[]|undefined} patternsDirs New multi-dir config.
 * @param {string|string[]|undefined} patternsDir Legacy single/multi config.
 * @return {string[]} Relative directory paths.
 */
function normalizePatternsDirsRelative(patternsDirs, patternsDir) {
	const raw = patternsDirs ?? patternsDir ?? 'patterns';

	if (Array.isArray(raw)) {
		return raw.filter(Boolean);
	}

	if (typeof raw === 'string' && raw) {
		return [raw];
	}

	return ['patterns'];
}

/**
 * Resolve relative/absolute dir entries to absolute paths.
 *
 * @param {string[]} relativeDirs Relative or absolute directories.
 * @param {string} productRoot Product root.
 * @return {string[]} Absolute directory paths.
 */
function resolvePatternsDirs(relativeDirs, productRoot) {
	return relativeDirs.map((dir) =>
		path.isAbsolute(dir) ? dir : path.join(productRoot, dir)
	);
}

/**
 * Load and normalize `.patterns.config.js`.
 *
 * @param {Object} [overrides] Optional overrides (CLI flags / webpack plugin).
 * @param {string} [productRoot] Product root override.
 * @return {Object} Options ready for localizePatterns().
 */
function loadPatternsConfig(overrides = {}, productRoot = PRODUCT_ROOT) {
	const configPath = getPatternsConfigPath(productRoot);

	if (!fs.existsSync(configPath)) {
		throw new Error(
			`Missing ${CONFIG_FILE_NAME} at ${configPath}. Create it with textDomain, uriPhpExpression, and patternsDirs.`
		);
	}

	// Fresh read when the file changes during watch.
	delete require.cache[require.resolve(configPath)];
	const fileConfig = require(configPath);

	const textDomain = overrides.textDomain ?? fileConfig.textDomain;
	const uriPhpExpression =
		overrides.uriPhpExpression ?? fileConfig.uriPhpExpression;
	const imagePathRoots = overrides.imagePathRoots ??
		fileConfig.imagePathRoots ?? ['assets', 'patterns/images'];

	const relativeDirs = normalizePatternsDirsRelative(
		overrides.patternsDirs ?? fileConfig.patternsDirs,
		overrides.patternsDir ?? fileConfig.patternsDir
	);

	if (!textDomain) {
		throw new Error(`${CONFIG_FILE_NAME}: textDomain is required.`);
	}

	if (!uriPhpExpression) {
		throw new Error(`${CONFIG_FILE_NAME}: uriPhpExpression is required.`);
	}

	const patternsDirs = resolvePatternsDirs(relativeDirs, productRoot);

	return {
		productRoot,
		configPath,
		textDomain,
		uriPhpExpression,
		imagePathRoots,
		patternsDirs,
		/** @deprecated Prefer patternsDirs; kept for callers that still read patternsDir. */
		patternsDir: patternsDirs[0],
		force: Boolean(overrides.force),
		quiet: Boolean(overrides.quiet),
		debug: Boolean(overrides.debug),
		check: Boolean(overrides.check),
	};
}

module.exports = {
	CONFIG_FILE_NAME,
	getProductRoot,
	getPatternsConfigPath,
	normalizePatternsDirsRelative,
	resolvePatternsDirs,
	loadPatternsConfig,
};
