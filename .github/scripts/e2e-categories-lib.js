const fs = require('fs');
const path = require('path');

const excludedDirs = ['node_modules', 'vendor', 'dist'];
const WP_ENV_CONFIGS_DIR = '.github/wp-env-configs';

const getFiles = (dir, pattern) => {
	if (!fs.existsSync(dir)) {
		return [];
	}

	const files = fs.readdirSync(dir);
	let allFiles = [];

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stats = fs.statSync(filePath);

		if (stats.isDirectory()) {
			if (!excludedDirs.includes(file)) {
				allFiles = [...allFiles, ...getFiles(filePath, pattern)];
			}
		} else if (pattern.test(filePath)) {
			allFiles.push(filePath);
		}
	});

	return allFiles;
};

const sortCategories = (categories) => {
	let sortedCategories = [...categories].sort();

	const generalCategories = sortedCategories.filter(
		(category) => category === 'general' || category.startsWith('general-')
	);

	const sortedGeneralCategories = generalCategories.sort();

	if (sortedGeneralCategories.length > 0) {
		sortedCategories = [
			...sortedGeneralCategories,
			...sortedCategories.filter(
				(category) => !category.startsWith('general')
			),
		];
	}

	return sortedCategories;
};

const getAllCategories = () => {
	const categories = new Set();

	getFiles('packages', /\.(.*?)\.e2e\.cy\.js/).forEach((file) => {
		const match = file.match(/\.(.*?)\.e2e\.cy\.js/);
		if (match && match[1]) {
			categories.add(match[1]);
		}
	});

	if (getFiles('packages', /\/[\w-]+\.e2e\.cy\.js/).length) {
		categories.add('general-1');
	}

	if (getFiles('tests', /\/[\w-]+\.e2e\.cy\.js/).length) {
		categories.add('general-1');
	}

	return sortCategories(Array.from(categories));
};

const getEnvProfile = (category) => {
	const configPath = path.join(WP_ENV_CONFIGS_DIR, `${category}.json`);

	if (fs.existsSync(configPath)) {
		return category;
	}

	return 'base';
};

const getFilteredCategoriesFromPrEnv = () => {
	if (!fs.existsSync('.pr-cypress.env.json')) {
		return null;
	}

	const config = JSON.parse(fs.readFileSync('.pr-cypress.env.json', 'utf8'));
	const patterns = config?.e2e?.specPattern || [];
	const categories = new Set();

	patterns.forEach((specPattern) => {
		const filename = path.basename(specPattern);
		const match = filename.match(/\.(.*?)\.e2e\.cy\.js$/);

		if (match && match[1]) {
			categories.add(match[1]);
			return;
		}

		if (/\/[\w-]+\.e2e\.cy\.js$/.test(specPattern)) {
			categories.add('general-1');
		}
	});

	return sortCategories(Array.from(categories));
};

const getSpecPattern = (category) => {
	if (category !== 'general-1') {
		let specPattern = `packages/**/*.${category}.e2e.cy.js`;

		if (fs.existsSync('tests')) {
			specPattern += `,tests/**/*.${category}.e2e.cy.js`;
		}

		return specPattern;
	}

	const searchDirs = ['packages'];

	if (fs.existsSync('tests')) {
		searchDirs.push('tests');
	}

	const files = [];

	searchDirs.forEach((dir) => {
		getFiles(dir, /\/[\w-]+\.e2e\.cy\.js$/).forEach((file) => {
			const basename = path.basename(file);

			if (/^[\w-]+\.e2e\.cy\.js$/.test(basename)) {
				files.push(file);
			}
		});
	});

	return files.join(',');
};

module.exports = {
	getAllCategories,
	getEnvProfile,
	getFilteredCategoriesFromPrEnv,
	getSpecPattern,
	sortCategories,
};
