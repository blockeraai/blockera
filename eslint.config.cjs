// Edit packages/global-packages/packages/dev-tools/root-configs/eslint.config.cjs
// project:bootstrap copies this to the host repo root.
const {
	createConfig,
} = require( './packages/global-packages/packages/dev-tools/js/eslint/config' );

module.exports = createConfig();
