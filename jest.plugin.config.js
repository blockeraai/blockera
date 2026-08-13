/**
 * Plugin-root Jest config.
 *
 * Extends the shared package config so CI `npm run test:js` also runs
 * deterministic tests under tests/unit (coverage for plugin-owned scripts
 * and package modules that are not yet covered next to source).
 */
const path = require('path');
const shared = require('./packages/global-packages/packages/dev-jest/js/jest.config.js');

module.exports = {
	...shared,
	roots: [...shared.roots, path.join(shared.rootDir, 'tests/unit')],
};
