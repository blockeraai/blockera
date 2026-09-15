/**
 * Free plugin Jest: shared GP packages, excluding Pro overlays.
 */
const base = require( './packages/global-packages/packages/dev-jest/js/jest.config.js' );

module.exports = {
	...base,
	testPathIgnorePatterns: [
		...( base.testPathIgnorePatterns || [] ),
		'/packages/[^/]*-pro(/|-)',
	],
};
