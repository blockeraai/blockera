// Edit packages/global-packages/packages/dev-tools/root-configs/.prettierrc.js
// project:bootstrap copies this to the host repo root.
const fs = require('fs');
const path = require('path');

const candidates = [
	// Host product root (copied file).
	path.join(
		__dirname,
		'packages/global-packages/packages/dev-tools/js/prettier/config.js'
	),
	// This file in root-configs/ (template).
	path.join(__dirname, '../js/prettier/config.js'),
];

const configPath = candidates.find((candidate) => fs.existsSync(candidate));

if (!configPath) {
	throw new Error(
		'Could not load Blockera Prettier config from ' +
			candidates.join(' or ')
	);
}

module.exports = require(configPath);
