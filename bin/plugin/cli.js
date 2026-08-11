#!/usr/bin/env node

/**
 * Internal dependencies
 */
const config = require('./config');
const {
	createPluginCli,
} = require('../../packages/global-packages/packages/dev-tools/bin/plugin/cli');

createPluginCli(config, {
	extraCommands(program, catchException) {
		program
			.command('test:snapshots:import')
			.option(
				'-d, --dry-run',
				'Show what would be done without actually creating posts'
			)
			.description(
				'Import all input.html files from tests/fixtures as WordPress posts'
			)
			.action(
				catchException(async (...args) => {
					const { testImport } = require('./commands/testImport');
					return testImport(...args);
				})
			);
	},
});
