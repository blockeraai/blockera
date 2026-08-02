/**
 * Internal dependencies
 */
const { escapeText } = require('./escape-text');

const ALLOWED_BLOCK_ATTRS = [
	{ name: 'label' },
	{ name: 'placeholder', isAttr: true },
	{ name: 'buttonText' },
	{ name: 'content' },
	{ name: 'ariaLabel', isAttr: true },
];

/**
 * Escape selected string attributes inside a Gutenberg block comment JSON blob.
 *
 * @param {string} block Raw block comment text (without surrounding delimiters).
 * @param {string} textDomain Text domain.
 * @return {string} Block comment text with escaped attrs when parseable.
 */
function escapeBlockAttrs(block, textDomain) {
	const start = block.indexOf('{');
	const end = block.lastIndexOf('}');

	if (start === -1 || end === -1 || start >= end) {
		return block;
	}

	const configPrefix = block.slice(0, start);
	const config = block.slice(start, end + 1);
	const configSuffix = block.slice(end + 1);

	try {
		const configJson = JSON.parse(config);

		for (const attr of ALLOWED_BLOCK_ATTRS) {
			if (!configJson[attr.name]) {
				continue;
			}

			configJson[attr.name] = escapeText(
				configJson[attr.name],
				textDomain,
				Boolean(attr.isAttr)
			);
		}

		return configPrefix + JSON.stringify(configJson) + configSuffix;
	} catch (error) {
		return block;
	}
}

module.exports = { escapeBlockAttrs, ALLOWED_BLOCK_ATTRS };
