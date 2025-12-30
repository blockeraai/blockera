/**
 * Support files for Playwright e2e tests.
 * Provides test setup, hooks, and helper functions.
 */

module.exports = {
	// E2E test setup with hooks and utilities
	e2e: require('./e2e'),
	// Custom commands/utilities
	commands: require('./commands'),
};
