// Edit packages/global-packages/packages/dev-tools/root-configs/cypress.config.js
// project:bootstrap copies this to the host repo root.
module.exports =
	require( './packages/global-packages/packages/dev-tools/js/cypress/config' )(
		{
			rootDir: __dirname,
			projectId: 'blockera',
			e2eExcludeSpecPattern: [
				'packages/**/*.build.e2e.js',
				'tests/performance/**',
				'**/packages/**/*-pro/**',
				'**/packages/**/*-pro-*/**',
			],
			componentExcludeSpecPattern: [
				'**/*.e2e.cy.js',
				'**/*.visual.cy.js',
				'**/packages/**/*-pro/**',
				'**/packages/**/*-pro-*/**',
			],
		}
	);
