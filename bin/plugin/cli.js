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

const { getReleaseChangelog } = require('./commands/changelog');

program
	.command('release-plugin-changelog')
	.alias('changelog')
	.option('-m, --milestone <milestone>', 'Milestone')
	.option('-t, --token <token>', 'GitHub token')
	.option(
		'-u, --unreleased',
		"Only include PRs that haven't been included in a release yet"
	)
	.description('Generates a changelog from merged Pull Requests')
	.action(catchException(getReleaseChangelog));

program.parse(process.argv);
