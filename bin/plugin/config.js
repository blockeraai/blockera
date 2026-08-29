/**
 * Internal dependencies
 */
const {
	createPluginCliConfig,
} = require('../../packages/global-packages/packages/dev-tools/bin/plugin/create-config');

const gitRepoOwner = 'blockeraai';

module.exports = createPluginCliConfig({
	slug: 'blockera',
	name: 'Blockera',
	team: 'Blockeraai',
	githubRepositoryOwner: gitRepoOwner,
	githubRepositoryName: 'blockera',
	pluginEntryPoint: 'blockera.php',
	buildZipCommand: '/bin/bash bin/build-plugin-zip.temp.sh',
	githubRepositoryURL: 'https://github.com/' + gitRepoOwner + '/blockera/',
	wpRepositoryReleasesURL: 'https://github.com/blockeraai/blockera/releases/',
	gitRepositoryURL: 'https://github.com/' + gitRepoOwner + '/blockera.git',
	svnRepositoryURL: 'https://plugins.svn.wordpress.org/blockera',
	changelog: {
		archiveUrl: 'https://community.blockera.ai/changelog-9l8hbrv0',
		archiveLabel: 'Blockera',
		includeCommitCount: true,
	},
});
