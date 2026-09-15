// Edit packages/global-packages/packages/dev-tools/root-configs/eslint.config.blockera.cjs
// project:bootstrap copies this to the host repo root for --project=blockera.
const {
	createConfig,
} = require( './packages/global-packages/packages/dev-tools/js/eslint/config' );

module.exports = createConfig( {
	extraIgnores: [
		'packages/*-pro/**',
		'packages/*-pro-*/**',
		'packages/global-packages/packages/**/*-pro/**',
		'packages/global-packages/packages/**/*-pro-*/**',
	],
} );
