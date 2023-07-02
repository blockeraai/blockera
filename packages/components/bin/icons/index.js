/**
 * External dependencies
 */
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const Fuse = require('fuse.js');

const jsonFiles = glob.sync('./packages/components/src/icons/**/*.json');

//Start Script
const icons = [];

jsonFiles.forEach((file) => {
	const currentFile =
		path.resolve(__dirname, '../..') +
		file.replace(/\.\/packages\/components/gi, '');

	if (
		currentFile.indexOf('fuse-index') !== -1 ||
		currentFile.indexOf('search-index') !== -1
	) {
		return;
	}

	icons.push(...require(currentFile));
});

const index = Fuse.createIndex(['title', 'tags'], icons);
const destinationFile =
	path.resolve(__dirname, '../..') + '/src/icons/' + process.argv[2];

fs.writeFileSync(destinationFile, JSON.stringify(index.toJSON()));
