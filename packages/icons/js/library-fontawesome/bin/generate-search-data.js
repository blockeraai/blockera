const fs = require('fs');
const path = require('path');
const { fas } = require('@fortawesome/free-solid-svg-icons');
const { fab } = require('@fortawesome/free-brands-svg-icons');
const { far } = require('@fortawesome/free-regular-svg-icons');

// Function to convert camelCase to Title Case
function camelToTitle(str) {
	return str
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (str) => str.toUpperCase())
		.trim();
}

// Function to generate tags from icon name
function generateTags(iconName) {
	const words = iconName
		.replace(/([A-Z])/g, ' $1')
		.toLowerCase()
		.split(' ')
		.filter((word) => word.length > 0);

	// Add the original words as tags
	const tags = [...new Set(words)];

	// Add some common variations
	if (tags.includes('arrow')) {
		tags.push('direction', 'pointer');
	}
	if (tags.includes('user')) {
		tags.push('person', 'profile', 'account');
	}
	// Add more variations as needed

	return tags;
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
				library: 'fontawesome',
				prefix,
				tags: generateTags(iconName),
			};
		});
};

// Combine all icon sets
const searchData = [
	...processIcons(fas, 'fas'),
	...processIcons(fab, 'fab'),
	...processIcons(far, 'far'),
];

// Write to search-data.json
const outputPath = path.join(__dirname, 'search-data.json');
fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2));

console.log(`Generated search-data.json with ${searchData.length} icons`);
