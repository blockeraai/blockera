/**
 * Prettier plugin: sort keys in theme-config JSON files on format (IDE + CLI).
 *
 * Enables sorting when:
 * - option `themeConfigSort` is true (set by .prettierrc.js override), or
 * - filepath is under theme-config/
 *
 * Using the option avoids depending on filepath inside preprocess (unreliable in
 * some prettier-vscode / multi-root paths).
 */

const { parsers: babelParsers } = require('prettier/parser-babel');
const { sortObjectKeys } = require('./sort-theme-json-keys');

const jsonParser = babelParsers.json;

/**
 * @param {string} text Raw JSON text.
 * @return {string} JSON text with keys sorted, or original text on parse error.
 */
function preprocessSorted(text) {
	try {
		return JSON.stringify(sortObjectKeys(JSON.parse(text)));
	} catch (error) {
		// Let Prettier surface the original parse error.
		return text;
	}
}

/**
 * @param {string} filepath Absolute or relative file path.
 * @return {boolean} Whether the path is a theme-config JSON file.
 */
function isThemeConfigJson(filepath) {
	if (!filepath) {
		return false;
	}

	const normalized = filepath.replace(/\\/g, '/');
	return (
		normalized.includes('/theme-config/') && normalized.endsWith('.json')
	);
}

/**
 * @param {Object} options Prettier options for the current format call.
 * @return {boolean} Whether theme-config key sorting should run.
 */
function shouldSortThemeConfig(options) {
	if (options?.themeConfigSort) {
		return true;
	}

	return isThemeConfigJson(options?.filepath || '');
}

module.exports = {
	options: {
		themeConfigSort: {
			type: 'boolean',
			category: 'Global',
			default: false,
			description:
				'Sort theme-config JSON keys (normal → : → css → elements → blocks; scalars first).',
		},
	},
	parsers: {
		json: {
			...jsonParser,
			preprocess(text, options) {
				if (!shouldSortThemeConfig(options)) {
					return text;
				}

				return preprocessSorted(text);
			},
		},
	},
};
