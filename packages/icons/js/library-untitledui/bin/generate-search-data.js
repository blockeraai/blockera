const fs = require('fs');
const path = require('path');
const untitleduiIcons = require('@untitledui/icons');
const feather = require('feather-icons');
const lucideTags = require('lucide-static/tags.json');

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

/**
 * Strip Untitled UI variant suffixes (e.g. home-0-1 → home).
 *
 * @param {string} iconName
 * @return {string} Icon name without Untitled UI variant suffix.
 */
function getBaseIconName(iconName) {
	return iconName.replace(/-\d+-\d+$/, '').replace(/-\d+$/, '');
}

const VARIANT_PARTS = new Set([
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'01',
	'02',
	'03',
	'04',
	'05',
]);

/**
 * Build search tags: Lucide + Feather metadata when names match, plus name tokens.
 * The Untitled UI npm package does not ship tags — same approach as Lucide tags.json.
 *
 * @param {string} iconName
 * @return {string[]} Search tags for the icon.
 */
function getIconTags(iconName) {
	const tags = [];
	const seen = new Set();
	const candidates = [iconName, getBaseIconName(iconName)];

	const addTag = (tag) => {
		const normalized = String(tag).trim().toLowerCase();

		if (!normalized || seen.has(normalized)) {
			return;
		}

		seen.add(normalized);
		tags.push(tag);
	};

	for (const candidate of candidates) {
		const lucide = lucideTags[candidate];

		if (Array.isArray(lucide)) {
			lucide.forEach(addTag);
		}

		const featherTags = feather.icons[candidate]?.tags;

		if (Array.isArray(featherTags)) {
			featherTags.forEach(addTag);
		}
	}

	getBaseIconName(iconName)
		.split('-')
		.filter((part) => part && !VARIANT_PARTS.has(part))
		.forEach(addTag);

	return tags;
}

const searchData = Object.keys(untitleduiIcons)
	.filter((key) => typeof untitleduiIcons[key] === 'function')
	.map((key) => {
		const iconName = getIconKebabId(key);

		return {
			iconName,
			title: iconNameToTitle(iconName),
			library: 'untitledui',
			tags: getIconTags(iconName),
		};
	});

const outputPath = path.join(__dirname, '..', 'search-data.json');
fs.writeFileSync(outputPath, `${JSON.stringify(searchData, null, '\t')}\n`);

console.log(`Generated search-data.json with ${searchData.length} icons`);
