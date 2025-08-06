/**
 * External dependencies
 */
const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');

/**
 * Utility to resolve file paths relative to the project root.
 */
function resolveProjectPath(relativePath) {
	return path.resolve(__dirname, '../', relativePath.replace(/^\.\//, ''));
}

/**
 * Load search configuration from the config file
 */
const searchConfigPath = resolveProjectPath(
	'./packages/icons/js/search-config.json'
);
let searchConfig = {};
try {
	searchConfig = require(searchConfigPath);
} catch (err) {
	console.error(
		`Failed to load search config from ${searchConfigPath}:`,
		err
	);
	process.exit(1);
}

/**
 * Load Font Awesome icon data from JSON file.
 */
const fontAwesomeDataPath = resolveProjectPath(
	'./packages/icons/js/library-fontawesome/search-data.json'
);
let icons = [];
try {
	const data = require(fontAwesomeDataPath);
	if (Array.isArray(data)) {
		icons = data;
	} else if (data && typeof data === 'object') {
		icons = [data];
	}
} catch (err) {
	console.error(
		`Failed to load Font Awesome data from ${fontAwesomeDataPath}:`,
		err
	);
	process.exit(1);
}

console.log('Total Font Awesome Icons:', icons.length);

const keys = searchConfig.keys || [
	{
		name: 'title',
		weight: 0.5,
	},
	{
		name: 'tags',
		weight: 0.2,
	},
];

/**
 * Create the search index using Fuse.js.
 */
const index = Fuse.createIndex(keys, icons);

/**
 * Write the index to the specified destination file.
 */
const outputFileName = process.argv[2] || 'search-fontawesome-index.json';
const destinationFile = resolveProjectPath(
	`./packages/icons/js/${outputFileName}`
);

try {
	fs.writeFileSync(destinationFile, JSON.stringify(index.toJSON(), null, 2));
	console.log(`Font Awesome search index written to ${destinationFile}`);
} catch (err) {
	console.error(`Failed to write search index to ${destinationFile}:`, err);
	process.exit(1);
}
