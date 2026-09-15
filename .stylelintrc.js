// Edit packages/global-packages/packages/dev-tools/root-configs/.stylelintrc.js
// project:bootstrap copies this to the host repo root.
const shared = require( './packages/global-packages/packages/dev-tools/js/stylelint/config' );

module.exports = {
	...shared,
	ignoreFiles: [
		...( shared.ignoreFiles || [] ),
		'packages/global-packages/packages/**/*-pro/**',
		'packages/global-packages/packages/**/*-pro-*/**',
	],
};
