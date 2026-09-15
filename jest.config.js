// Edit packages/global-packages/packages/dev-tools/root-configs/jest.config.blockera.js
// project:bootstrap copies this to the host repo root for --project=blockera.
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
