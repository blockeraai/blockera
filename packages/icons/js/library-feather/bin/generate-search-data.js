const fs = require('fs');
const path = require('path');
const feather = require('feather-icons');

/**
 * @param {string} iconName
 * @return {string} Human-readable icon title.
 */
function iconNameToTitle(iconName) {
	return iconName
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

const searchData = Object.keys(feather.icons).map((iconName) => ({
	iconName,
	title: iconNameToTitle(iconName),
	library: 'feather',
	tags: feather.icons[iconName].tags || [],
}));

const outputPath = path.join(__dirname, '..', 'search-data.json');
fs.writeFileSync(outputPath, `${JSON.stringify(searchData, null, '\t')}\n`);

console.log(`Generated search-data.json with ${searchData.length} icons`);
