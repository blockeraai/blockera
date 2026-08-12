/**
 * Jest config for the Blockera plugin consumer.
 *
 * Extends the shared global-packages config with plugin-root unit tests
 * (recent coverage for code that lives outside package `test/` folders).
 */
const shared = require('./packages/global-packages/packages/dev-jest/js/jest.config.js');

const roots = Array.isArray(shared.roots) ? shared.roots : [shared.roots];

module.exports = {
	...shared,
	roots: [...roots, '<rootDir>/tests/unit'],
};
