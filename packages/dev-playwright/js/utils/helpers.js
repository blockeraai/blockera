/**
 * Main helper utilities export for Playwright e2e tests.
 * Re-exports all helper modules for convenience.
 */

// Export all editor utilities
const editorUtils = require('./editor');
// Export admin utilities
const adminUtils = require('./admin');
// Export inner blocks utilities
const innerBlocksUtils = require('./inner-blocks');
// Export block states utilities
const blockStatesUtils = require('./block-states');
// Export responsive utilities
const responsiveUtils = require('./responsive');
// Export controls utilities
const controlsUtils = require('./controls');
// Export box position utilities
const boxPositionUtils = require('./controls-box-position');
// Export box spacing utilities
const boxSpacingUtils = require('./controls-box-spacing');
// Export other utilities
const otherUtils = require('./other');
// Export site navigation utilities
const siteNavigationUtils = require('./site-navigation');
// Export create term utilities
const createTermUtils = require('./create-term');

module.exports = {
	// Editor utilities
	...editorUtils,
	// Admin utilities
	...adminUtils,
	// Inner blocks utilities
	...innerBlocksUtils,
	// Block states utilities
	...blockStatesUtils,
	// Responsive utilities
	...responsiveUtils,
	// Controls utilities
	...controlsUtils,
	// Box position utilities
	...boxPositionUtils,
	// Box spacing utilities
	...boxSpacingUtils,
	// Other utilities
	...otherUtils,
	// Site navigation utilities
	...siteNavigationUtils,
	// Create term utilities
	...createTermUtils,
};
