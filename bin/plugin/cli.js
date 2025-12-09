#!/usr/bin/env node

/**
 * External dependencies
 */
const program = require('commander');

const catchException = (command) => {
	return async (...args) => {
		try {
			await command(...args);
		} catch (error) {
			console.error(error);
			process.exitCode = 1;
		}
	};
};

const releaseType = ['--releaseType <releaseType>', 'Release Type'];

const { getReleaseChangelog } = require('./commands/changelog');
const { updatePackagesChangelog } = require('./commands/packages');
const { testImport } = require('./commands/testImport');

program
	.command('update-packages-changelog')
	.option('-v, --version <version>', 'Version')
	.option(...releaseType)
	.description('Blockera plugin and packages changelogs publishes to git.')
	.action(catchException(updatePackagesChangelog));

program
	.command('release-plugin-changelog')
	.alias('changelog')
	.option('-f, --file <file>', 'File')
	.option('-v, --version <version>', 'Version')
	.option('-m, --milestone <milestone>', 'Milestone')
	.option('-t, --token <token>', 'GitHub token')
	.option(
		'-u, --unreleased',
		"Only include PRs that haven't been included in a release yet"
	)
	.description('Generates a changelog from merged Pull Requests')
	.action(catchException(getReleaseChangelog));

program
	.command('test:snapshots:import')
	.option(
		'-d, --dry-run',
		'Show what would be done without actually creating posts'
	)
	.description(
		'Import all input.html files from tests/fixtures as WordPress posts'
	)
	.action(catchException(testImport));

program.parse(process.argv);
