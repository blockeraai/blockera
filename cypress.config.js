// Edit packages/global-packages/packages/dev-tools/root-configs/cypress.config.blockera.js
// project:bootstrap copies this to the host repo root for --project=blockera.
const OVERLAY_PACKAGE_GLOBS = [
	'packages/*-pro/**',
	'packages/*-pro-*/**',
	'packages/global-packages/packages/**/*-pro/**',
	'packages/global-packages/packages/**/*-pro-*/**',
	'packages/*-one/**',
	'packages/*-one-*/**',
	'packages/global-packages/packages/**/*-one/**',
	'packages/global-packages/packages/**/*-one-*/**',
	'packages/*-toolkit/**',
	'packages/*-toolkit-*/**',
	'packages/global-packages/packages/**/*-toolkit/**',
	'packages/global-packages/packages/**/*-toolkit-*/**',
];

module.exports =
	require( './packages/global-packages/packages/dev-tools/js/cypress/config' )(
		{
			rootDir: __dirname,
			projectId: 'blockera',
			alwaysExcludeSpecPattern: [
				'packages/**/*.build.e2e.js',
				'tests/performance/**',
				...OVERLAY_PACKAGE_GLOBS,
			],
			componentExcludeSpecPattern: [
				'**/*.e2e.cy.js',
				'**/*.visual.cy.js',
				...OVERLAY_PACKAGE_GLOBS,
			],
		}
	);
