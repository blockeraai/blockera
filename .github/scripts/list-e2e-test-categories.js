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
	const categories = new Set();

	const categorizedFiles = getFiles('packages', /\.(.*?)\.e2e\.cy\.js/);
	categorizedFiles.forEach((file) => {
		const match = file.match(/\.(.*?)\.e2e\.cy\.js/);
		if (match && match[1]) {
			categories.add(match[1]);
		}
	});

	const generalFiles = getFiles('packages', /\/[\w-]+\.e2e\.cy\.js/);
	if (generalFiles.length) {
		categories.add('general-1');
	}

	// sort the categories
	let sortedCategories = Array.from(categories).sort();

	// Find all general-related categories
	const generalCategories = sortedCategories.filter(
		(category) => category === 'general' || category.startsWith('general-')
	);

	// Sort general categories to ensure they're in order (general, general-1, general-2, etc.)
	const sortedGeneralCategories = generalCategories.sort();

	if (sortedGeneralCategories.length > 0) {
		// Remove all general categories from the original array and add the sorted ones at the beginning
		sortedCategories = [
			...sortedGeneralCategories,
			...sortedCategories.filter(
				(category) => !category.startsWith('general')
			),
		];
	}

	console.log(JSON.stringify(sortedCategories));
};

main();
