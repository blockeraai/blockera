/**
 * Free plugin Jest: shared GP packages, excluding Pro, One, and toolkit overlays.
 */
const base = require( './packages/global-packages/packages/dev-jest/js/jest.config.js' );

module.exports = {
	...base,
	testPathIgnorePatterns: [
		...( base.testPathIgnorePatterns || [] ),
		'/packages/[^/]*-pro(/|-)',
		'/packages/[^/]*-one(/|-)',
		'/packages/[^/]*-toolkit(/|-)',
	],
};
