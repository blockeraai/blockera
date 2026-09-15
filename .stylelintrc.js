// Edit packages/global-packages/packages/dev-tools/root-configs/.stylelintrc.blockera.js
// project:bootstrap copies this to the host repo root for --project=blockera.
const shared = require( './packages/global-packages/packages/dev-tools/js/stylelint/config' );

module.exports = {
	...shared,
	ignoreFiles: [
		...( shared.ignoreFiles || [] ),
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
	],
};
