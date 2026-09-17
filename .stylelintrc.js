// Edit packages/global-packages/packages/dev-tools/root-configs/.stylelintrc.blockera.js
// project:bootstrap copies this to the host repo root for --project=blockera.
const fs = require('fs');
const path = require('path');
const shared = require('./packages/global-packages/packages/dev-tools/js/stylelint/config');
const lockfileExtraIgnoresPath = path.join(
	__dirname,
	'packages/global-packages/packages/dev-tools/js/consumer-packages/lockfile-extra-ignores.cjs'
);
const getLockfileExtraIgnores = fs.existsSync(lockfileExtraIgnoresPath)
	? require(lockfileExtraIgnoresPath).getLockfileExtraIgnores
	: () => [];

module.exports = {
	...shared,
	ignoreFiles: [
		...(shared.ignoreFiles || []),
		...getLockfileExtraIgnores(__dirname),
	],
};
