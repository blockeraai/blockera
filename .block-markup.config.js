/**
 * Block-markup pipeline for Blockera (plugin).
 *
 * No pattern PHP. Template HTML lives in tests/fixtures.
 * Prettier only — do not sanitize fixture attrs (queryId, metadata).
 * webpack: false so `npm start` does not rewrite fixtures.
 *
 * Prettier post-process flags inherit from GP `base-config.js`. Override
 * sparsely, for example:
 *   prettier: { breakFormControlTags: false }
 *
 * Consumed by:
 * - `npm run block-markup:normalize` / `block-markup:check` / `block-markup:prettier`
 */

module.exports = {
	textDomain: 'blockera',
	uriPhpExpression: 'plugin_dir_url( BLOCKERA_SB_FILE )',
	templatesDirs: ['tests/fixtures'],
	steps: {
		templates: ['prettier'],
	},
	webpack: true,
};
