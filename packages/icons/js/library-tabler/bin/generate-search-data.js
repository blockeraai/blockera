const fs = require('fs');
const path = require('path');

/**
 * Resolve @tabler/icons package root from node_modules.
 *
 * @return {string} Absolute path to the @tabler/icons package root.
 */
function getTablerIconsRoot() {
	let dir = __dirname;

	while (dir !== path.dirname(dir)) {
		const candidate = path.join(dir, 'node_modules', '@tabler', 'icons');

		if (fs.existsSync(path.join(candidate, 'icons.json'))) {
			return candidate;
		}

		dir = path.dirname(dir);
	}

	throw new Error('@tabler/icons package not found in node_modules');
}

const tablerIconsMeta = JSON.parse(
	fs.readFileSync(path.join(getTablerIconsRoot(), 'icons.json'), 'utf8')
);

const VARIANT_CONFIG = {
	outline: {
		library: 'tabler',
		libraryDir: path.join(__dirname, '..'),
		styleKey: 'outline',
	},
	filled: {
		library: 'tabler-filled',
		libraryDir: path.join(__dirname, '..', '..', 'library-tabler-filled'),
		styleKey: 'filled',
	},
};

/**
 * @param {string} arg
 * @return {string | null} Parsed variant flag or null.
 */
function getVariantArg(arg) {
	const match = arg.match(/^--variant=(outline|filled)$/);

	return match ? match[1] : null;
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
 * @param {unknown} tags
 * @param {string | undefined} category
 * @return {string[]} Search tags for the icon.
 */
function buildTags(tags, category) {
	const result = [];
	const seen = new Set();

	const addTag = (tag) => {
		const normalized = String(tag).trim().toLowerCase();

		if (!normalized || seen.has(normalized)) {
			return;
		}

		seen.add(normalized);
		result.push(String(tag).trim());
	};

	if (Array.isArray(tags)) {
		tags.forEach(addTag);
	}

	if (category) {
		addTag(category);
	}

	return result;
}

const variant = process.argv.slice(2).map(getVariantArg).find(Boolean);

if (!variant) {
	console.error(
		'Usage: node generate-search-data.js --variant=outline|filled'
	);
	process.exit(1);
}

const config = VARIANT_CONFIG[variant];

const searchData = Object.entries(tablerIconsMeta)
	.filter(([, meta]) => meta?.styles?.[config.styleKey])
	.map(([iconName, meta]) => ({
		iconName,
		title: iconNameToTitle(iconName),
		library: config.library,
		tags: buildTags(meta.tags, meta.category),
	}))
	.sort((a, b) => a.iconName.localeCompare(b.iconName));

const outputPath = path.join(config.libraryDir, 'search-data.json');
fs.writeFileSync(outputPath, `${JSON.stringify(searchData, null, '\t')}\n`);

console.log(
	`Generated ${outputPath} with ${searchData.length} ${variant} icons`
);
