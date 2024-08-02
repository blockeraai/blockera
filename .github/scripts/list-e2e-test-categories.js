const fs = require('fs');
const path = require('path');

const excludedDirs = ['node_modules', 'vendor', 'dist'];

const getFiles = (dir, pattern) => {
	const files = fs.readdirSync(dir);
	let allFiles = [];

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			// Skip excluded directories
			if (!excludedDirs.includes(file)) {
				allFiles = [...allFiles, ...getFiles(filePath, pattern)];
			}
		} else if (pattern.test(filePath)) {
			allFiles.push(filePath);
		}
	});

	return allFiles;
};

const main = () => {
	const testFiles = getFiles('packages', /\.cy\.e2e\.(.*?)\.js/);
	const categories = new Set();

	testFiles.forEach((file) => {
		const match = file.match(/\.cy\.e2e\.(.*?)\.js/);
		if (match && match[1]) {
			categories.add(match[1]);
		}
	});

	console.log(JSON.stringify(Array.from(categories).sort()));
};

main();
