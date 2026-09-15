// Edit packages/global-packages/packages/dev-tools/root-configs/cypress.config.blockera.js
// project:bootstrap copies this to the host repo root for --project=blockera.
const PRO_PACKAGE_GLOBS = [
	'packages/*-pro/**',
	'packages/*-pro-*/**',
	'packages/global-packages/packages/**/*-pro/**',
	'packages/global-packages/packages/**/*-pro-*/**',
];

module.exports =
	require( './packages/global-packages/packages/dev-tools/js/cypress/config' )(
		{
			rootDir: __dirname,
			projectId: 'blockera',
			alwaysExcludeSpecPattern: [
				'packages/**/*.build.e2e.js',
				'tests/performance/**',
				...PRO_PACKAGE_GLOBS,
			],
			componentExcludeSpecPattern: [
				'**/*.e2e.cy.js',
				'**/*.visual.cy.js',
				...PRO_PACKAGE_GLOBS,
			],
		}
	);
