const fs = require('fs');
const path = require('path');

const getFiles = (dir, pattern) => {
	const files = fs.readdirSync(dir);
	let allFiles = [];

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		if (fs.statSync(filePath).isDirectory()) {
			allFiles = [...allFiles, ...getFiles(filePath, pattern)];
		} else if (file.match(pattern)) {
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

	console.log(JSON.stringify(Array.from(categories)));
};

main();
