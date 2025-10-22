/**
 * External dependencies
 */
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const Fuse = require('fuse.js');

/**
 * Utility to resolve file paths relative to the project root.
 */
function resolveProjectPath(relativePath) {
	return path.resolve(__dirname, '../', relativePath.replace(/^\.\//, ''));
}

/**
 * Load search libraries from the configuration file
 */
const searchLibrariesPath = resolveProjectPath(
	'./packages/icons/js/search-libraries.json'
);
let searchLibraries = [];
try {
	searchLibraries = require(searchLibrariesPath);
} catch (err) {
	console.error(
		`Failed to load search libraries from ${searchLibrariesPath}:`,
		err
	);
	process.exit(1);
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
 * Generate jsonFiles array based on search libraries
 */
const jsonFiles = searchLibraries.map(
	(library) => `./packages/icons/js/library-${library}/search-data.json`
);

/**
 * Load and flatten all icon data from JSON files.
 */
const icons = [];

for (const file of jsonFiles) {
	const absPath = resolveProjectPath(file);
	let data;
	try {
		data = require(absPath);
	} catch (err) {
		console.error(`Failed to require ${absPath}:`, err);
		continue;
	}
	if (Array.isArray(data)) {
		icons.push(...data);
	} else if (data && typeof data === 'object') {
		icons.push(data);
	}
}

console.log('Library Search Data Files:', jsonFiles);

console.log('Total Icons:', icons.length);

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
const destinationFile = resolveProjectPath(
	`./packages/icons/js/search-index.json`
);

try {
	fs.writeFileSync(destinationFile, JSON.stringify(index.toJSON(), null, 2));
	console.log(`Search index written to ${destinationFile}`);
} catch (err) {
	console.error(`Failed to write search index to ${destinationFile}:`, err);
	process.exit(1);
}
