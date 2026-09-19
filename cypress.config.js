// Edit packages/global-packages/packages/dev-tools/root-configs/cypress.config.blockera.js
// project:bootstrap copies this to the host repo root for --project=blockera.
// Undeclared GP packages are excluded by the shared Cypress factory from
// package.json `dependencies` (`@blockera/*` `file:`).
module.exports =
	require('./packages/global-packages/packages/dev-tools/js/cypress/config')({
		rootDir: __dirname,
		projectId: 'blockera',
		alwaysExcludeSpecPattern: [
			'packages/**/*.build.e2e.js',
			'tests/performance/**',
		],
		componentExcludeSpecPattern: ['**/*.e2e.cy.js', '**/*.visual.cy.js'],
	});
