const fs = require('fs');
const path = require('path');
const { fas } = require('@fortawesome/free-solid-svg-icons');

// Function to convert camelCase to Title Case
function camelToTitle(str) {
	return str
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (str) => str.toUpperCase())
		.trim();
}

// Process all icons
const processIcons = (icons, prefix) => {
	return Object.entries(icons)
		.filter(
			([key]) =>
				key !== 'prefix' &&
				key !== 'fas' &&
				key !== 'fab' &&
				key !== 'far'
		)
		.map(([key]) => {
			const iconName = key
				.replace(/^fa/, '')
				.replace(/^[A-Z]/, (c) => c.toLowerCase());
			return {
				iconName,
				title: camelToTitle(iconName),
				library: 'fasolid',
				prefix,
				tags: [],
			};
		});
};

// Combine all icon sets
const searchData = [...processIcons(fas, 'fas')];

// Write to search-data.json
const outputPath = path.join(__dirname, 'search-data.json');
fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2));

console.log(`Generated search-data.json with ${searchData.length} icons`);
