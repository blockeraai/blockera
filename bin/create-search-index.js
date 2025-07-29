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
 * Get all relevant JSON files, excluding index files.
 */
const jsonFiles = glob
	.sync('./packages/icons/js/**/*.json')
	.filter((file) => !/fuse-index|search-index/i.test(file));

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

const keys = [
	{
		name: 'title', // Search the 'title' property
		weight: 2, // Give it a high weight, as titles are very important.
	},
	{
		name: 'tags', // Search the 'tags' array
		weight: 1.5, // Tags are also very important.
	},
	{
		name: 'iconName', // Search the 'iconName'
		weight: 1, // Less important than title/tags, but still relevant.
	},
];

/**
 * Create the search index using Fuse.js.
 */
const index = Fuse.createIndex(keys, icons);

/**
 * Write the index to the specified destination file.
 */
const outputFileName = process.argv[2];
if (!outputFileName) {
	console.error('Error: Output file name must be provided as an argument.');
	process.exit(1);
}
const destinationFile = resolveProjectPath(
	`./packages/icons/js/${outputFileName}`
);

try {
	fs.writeFileSync(destinationFile, JSON.stringify(index.toJSON(), null, 2));
	console.log(`Search index written to ${destinationFile}`);
} catch (err) {
	console.error(`Failed to write search index to ${destinationFile}:`, err);
	process.exit(1);
}
