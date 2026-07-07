/**
 * Sync missing icon entries into each library's search-data.json.
 *
 * Uses the same exported-icon sources as packages/icons/js/.patch/icons.js
 * without importing SVG/React modules (safe for plain Node execution).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ICONS_JS = path.join(ROOT, 'packages/icons/js');

const FA_PREFIXES = {
	faregular: 'far',
	fasolid: 'fas',
	fabrands: 'fab',
};

/**
 * Returns a kebab-cased string of the given icon component name.
 *
 * @param {string} str
 * @return {string}
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
 * @return {string}
 */
function iconNameToTitle(iconName) {
	return iconName
		.split('-')
		.map((part, index) => {
			if (index === 0) {
				return part.charAt(0).toUpperCase() + part.slice(1);
			}
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join(' ');
}

/**
 * @param {string} iconName
 * @return {string}
 */
function faIconNameToTitle(iconName) {
	return iconName
		.replace(/^fa-/, '')
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

/**
 * @param {string} indexPath
 * @return {string[]}
 */
function getExportedNamesFromIndex(indexPath) {
	const content = fs.readFileSync(indexPath, 'utf8');
	const names = [];
	const exportRegex = /export\s+\{\s*default\s+as\s+(\w+)/g;
	let match;

	while ((match = exportRegex.exec(content)) !== null) {
		names.push(getIconKebabId(match[1]));
	}

	return names;
}

/**
 * @return {string[]}
 */
function getWpIconNames() {
	const rawIcons = require('@wordpress/icons');

	return Object.keys(rawIcons)
		.map((key) => getIconKebabId(key))
		.filter((name) => name !== 'icon');
}

/**
 * @return {string[]}
 */
function getFaRegularIconNames() {
	const freeRegularIcons = require('@fortawesome/free-regular-svg-icons');

	return Object.keys(freeRegularIcons)
		.map((key) => getIconKebabId(key))
		.filter(
			(key) => !['far', 'prefix'].includes(key) && !key.endsWith('-alt')
		);
}

/**
 * @param {string} key
 * @return {string}
 */
function normalizeFaSolidKey(key) {
	switch (key) {
		case 'fa-dice-d-2-0':
			return 'fa-dice-d20';
		case 'fa-dice-d-6':
			return 'fa-dice-d6';
		case 'fa-stopwatch-2-0':
			return 'fa-stopwatch-20';
		default:
			return key;
	}
}

/**
 * @return {string[]}
 */
function getFaSolidIconNames() {
	const freeIcons = require('@fortawesome/free-solid-svg-icons');

	return Object.keys(freeIcons)
		.map((key) => normalizeFaSolidKey(getIconKebabId(key)))
		.filter(
			(key) => !['fas', 'prefix'].includes(key) && !key.endsWith('-alt')
		);
}

/**
 * @param {string} key
 * @return {string}
 */
function normalizeFaBrandsKey(key) {
	switch (key) {
		case 'fa-5-0-0px':
			return 'fa-500px';
		case 'fa-1-1ty':
			return 'fa-11ty';
		case 'fa-4-2-group':
			return 'fa-42-group';
		case 'fa-css-3':
			return 'fa-css3';
		case 'fa-css-3-alt':
			return 'fa-css3-alt';
		case 'fa-html-5':
			return 'fa-html5';
		case 'fa-draft-2digital':
			return 'fa-draft2digital';
		case 'fa-ns-8':
			return 'fa-ns8';
		case 'fa-page-4':
			return 'fa-page4';
		case 'fa-typo-3':
			return 'fa-typo3';
		case 'fa-w-3c':
			return 'fa-w3c';
		default:
			return key;
	}
}

/**
 * @return {string[]}
 */
function getFaBrandsIconNames() {
	const freeBrandsIcons = require('@fortawesome/free-brands-svg-icons');

	return Object.keys(freeBrandsIcons)
		.map((key) => normalizeFaBrandsKey(getIconKebabId(key)))
		.filter((key) => !['fab', 'prefix'].includes(key));
}

/**
 * @return {string[]}
 */
function getFeatherIconNames() {
	const feather = require('feather-icons');

	return Object.keys(feather.icons);
}

/**
 * @return {string[]}
 */
function getLucideIconNames() {
	const lucideStatic = require('lucide-static');

	return Object.keys(lucideStatic)
		.filter((key) => typeof lucideStatic[key] === 'string')
		.map((key) => getIconKebabId(key));
}

/**
 * @return {string[]}
 */
function getUntitleduiIconNames() {
	const untitleduiIcons = require('@untitledui/icons');

	return Object.keys(untitleduiIcons)
		.filter((key) => typeof untitleduiIcons[key] === 'function')
		.map((key) => getIconKebabId(key));
}

/**
 * Read icon names from a codegen icons.js map (Tabler libraries).
 *
 * @param {string} iconsJsPath
 * @param {string} exportName
 * @return {string[]}
 */
function getGeneratedIconsObjectNames(iconsJsPath, exportName) {
	if (!fs.existsSync(iconsJsPath)) {
		return [];
	}

	const content = fs.readFileSync(iconsJsPath, 'utf8');
	const match = content.match(
		new RegExp(`export const ${exportName}: Object = (\\{[\\s\\S]*\\});`)
	);

	if (!match) {
		return [];
	}

	return Object.keys(JSON.parse(match[1]));
}

/**
 * @param {string} libraryId
 * @return {string[]}
 */
function getExportedIconNames(libraryId) {
	switch (libraryId) {
		case 'wp':
			return getWpIconNames();
		case 'blockera':
		case 'cursor':
		case 'brands':
		case 'essentials':
			return getExportedNamesFromIndex(
				path.join(ICONS_JS, `library-${libraryId}/icons/index.js`)
			);
		case 'faregular':
			return getFaRegularIconNames();
		case 'fasolid':
			return getFaSolidIconNames();
		case 'fabrands':
			return getFaBrandsIconNames();
		case 'feather':
			return getFeatherIconNames();
		case 'lucide':
			return getLucideIconNames();
		case 'untitledui':
			return getUntitleduiIconNames();
		case 'tabler':
			return getGeneratedIconsObjectNames(
				path.join(ICONS_JS, 'library-tabler/icons.js'),
				'TablerIcons'
			);
		case 'tabler-filled':
			return getGeneratedIconsObjectNames(
				path.join(ICONS_JS, 'library-tabler-filled/icons.js'),
				'TablerFilledIcons'
			);
		default:
			return [];
	}
}

/**
 * @param {string} libraryId
 * @param {string} iconName
 * @return {{ iconName: string, title: string, library: string, tags: string[], prefix?: string }}
 */
function createSearchDataEntry(libraryId, iconName) {
	const entry = {
		iconName,
		title: FA_PREFIXES[libraryId]
			? faIconNameToTitle(iconName)
			: iconNameToTitle(iconName),
		library: libraryId,
		tags: [],
	};

	if (FA_PREFIXES[libraryId]) {
		entry.prefix = FA_PREFIXES[libraryId];
	}

	return entry;
}

/**
 * @return {string[]}
 */
function getSearchLibraries() {
	const libraries1 = require(path.join(ICONS_JS, 'search-libraries.json'));
	const libraries2 = require(path.join(ICONS_JS, 'search-libraries-2.json'));

	return [...libraries1, ...libraries2];
}

/**
 * @return {{ totalAdded: number, byLibrary: Record<string, number> }}
 */
function syncMissingIconsToSearchData() {
	const searchLibraries = getSearchLibraries();
	const byLibrary = {};
	let totalAdded = 0;

	searchLibraries.forEach((libraryId) => {
		const searchDataPath = path.join(
			ICONS_JS,
			`library-${libraryId}/search-data.json`
		);

		if (!fs.existsSync(searchDataPath)) {
			console.warn(
				`⚠️  Skipping ${libraryId}: search-data.json not found`
			);
			return;
		}

		const exportedIconNames = getExportedIconNames(libraryId);

		if (exportedIconNames.length === 0) {
			console.warn(`⚠️  Skipping ${libraryId}: no exported icons found`);
			return;
		}

		const searchData = JSON.parse(fs.readFileSync(searchDataPath, 'utf8'));
		const searchDataIconNames = new Set(
			searchData.map((item) => item.iconName)
		);
		const missingIconNames = exportedIconNames.filter(
			(iconName) => !searchDataIconNames.has(iconName)
		);

		if (missingIconNames.length === 0) {
			console.log(`✅ ${libraryId}: search data is complete`);
			return;
		}

		const newEntries = missingIconNames.map((iconName) =>
			createSearchDataEntry(libraryId, iconName)
		);

		searchData.push(...newEntries);
		fs.writeFileSync(
			searchDataPath,
			`${JSON.stringify(searchData, null, '\t')}\n`
		);

		byLibrary[libraryId] = newEntries.length;
		totalAdded += newEntries.length;

		console.log(
			`Added ${newEntries.length} missing icon(s) to ${libraryId}:`
		);
		newEntries.forEach((entry) => {
			console.log(`  + ${entry.iconName}`);
		});
	});

	return { totalAdded, byLibrary };
}

const result = syncMissingIconsToSearchData();

if (result.totalAdded === 0) {
	console.log('\nAll icon libraries have complete search data.');
} else {
	console.log(
		`\nAdded ${result.totalAdded} missing icon(s) across ${Object.keys(result.byLibrary).length} library/libraries.`
	);
}
