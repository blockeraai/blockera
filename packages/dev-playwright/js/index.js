/**
 * Main entry point for @blockera/dev-playwright package.
 *
 * This package provides Playwright configuration, fixtures, and helper utilities
 * for writing e2e tests in the Blockera plugin ecosystem.
 */

module.exports = {
	// Export fixtures (main test fixtures)
	fixtures: require('./fixtures/editor'),
	// Export support files (commands, e2e setup)
	support: require('./support/index'),
	// Export all utilities
	utils: require('./utils/helpers'),
	// Export individual utility modules
	admin: require('./utils/admin'),
	editor: require('./utils/editor'),
	innerBlocks: require('./utils/inner-blocks'),
	blockStates: require('./utils/block-states'),
	responsive: require('./utils/responsive'),
	controls: require('./utils/controls'),
	boxPosition: require('./utils/controls-box-position'),
	boxSpacing: require('./utils/controls-box-spacing'),
	other: require('./utils/other'),
	siteNavigation: require('./utils/site-navigation'),
	createTerm: require('./utils/create-term'),
	// Export commands (custom Playwright commands)
	commands: require('./support/commands'),
	// Export config
	config: require('./config/global-setup'),
};
