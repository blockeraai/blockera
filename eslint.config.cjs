// Edit packages/global-packages/packages/dev-tools/root-configs/eslint.config.blockera.cjs
// project:bootstrap copies this to the host repo root for --project=blockera.
const fs = require('fs');
const path = require('path');
const {
	createConfig,
} = require('./packages/global-packages/packages/dev-tools/js/eslint/config');
const lockfileExtraIgnoresPath = path.join(
	__dirname,
	'packages/global-packages/packages/dev-tools/js/consumer-packages/lockfile-extra-ignores.cjs'
);
const getLockfileExtraIgnores = fs.existsSync(lockfileExtraIgnoresPath)
	? require(lockfileExtraIgnoresPath).getLockfileExtraIgnores
	: () => [];

module.exports = createConfig({
	extraIgnores: getLockfileExtraIgnores(__dirname),
});
