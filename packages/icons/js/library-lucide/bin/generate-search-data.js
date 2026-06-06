const fs = require('fs');
const path = require('path');
const lucideStatic = require('lucide-static');
const tags = require('lucide-static/tags.json');

/**
 * Returns a kebab-cased string of the given icon component name.
 *
 * @param {string} str
 * @return {string} Kebab-cased icon id.
 */
function getIconKebabId(str) {
	return str.replace(/[A-Z0-9]/g, (match, index) => {
		if (index === 0) {
			return match.toLowerCase();
		}
		if (/[0-9]/.test(match)) {
			return `-${match}`;
		}
		return `-${match.toLowerCase()}`;
	});
}

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

const searchData = Object.keys(lucideStatic)
	.filter((key) => typeof lucideStatic[key] === 'string')
	.map((key) => {
		const iconName = getIconKebabId(key);

		return {
			iconName,
			title: iconNameToTitle(iconName),
			library: 'lucide',
			tags: tags[iconName] || [],
		};
	});

const outputPath = path.join(__dirname, '..', 'search-data.json');
fs.writeFileSync(outputPath, `${JSON.stringify(searchData, null, '\t')}\n`);

console.log(`Generated search-data.json with ${searchData.length} icons`);
