/**
 * Merge modular theme-config/ sources into the root theme.json.
 *
 * Usage:
 *   node packages/dev-tools/js/theme-json/merge-theme-json.js           # write
 *   node packages/dev-tools/js/theme-json/merge-theme-json.js --check   # verify
 */

const fs = require('fs');
const path = require('path');
const {
	compareThemeJsonKeys,
	sortObjectKeys,
	themeJsonKeyRank,
} = require('./sort-theme-json-keys');

// packages/dev-tools/js/theme-json → product root (theme or plugin)
const THEME_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const CONFIG_DIR = path.join(THEME_ROOT, 'theme-config');
const OUTPUT_FILE = path.join(THEME_ROOT, 'theme.json');

/** Manual root keys (formerly theme-config/main.json). */
const MANUAL_ROOT = {
	$schema: 'https://schemas.wp.org/wp/6.7/theme.json',
	version: 3,
};

/**
 * Read and parse a JSON file; throw with path on failure.
 *
 * @param {string} filePath Absolute path to a JSON file.
 * @return {Object} Parsed JSON object.
 */
function readJson(filePath) {
	try {
		return JSON.parse(fs.readFileSync(filePath, 'utf8'));
	} catch (error) {
		throw new Error(`Failed to parse JSON: ${filePath}\n${error.message}`);
	}
}

/**
 * Recursively merge a directory:
 * - *.json files → shallow-merge into the result object
 * - subdirectories → folder name becomes a key; recurse
 *
 * @param {string} dir Directory to merge.
 * @return {Object} Merged and sorted section object.
 */
function mergeDirectory(dir) {
	if (!fs.existsSync(dir)) {
		return {};
	}

	const merged = {};
	const entries = fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((entry) => !entry.name.startsWith('.'))
		.sort((a, b) => a.name.localeCompare(b.name));

	for (const entry of entries) {
		const entryPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			merged[entry.name] = mergeDirectory(entryPath);
			continue;
		}

		if (!entry.isFile() || !entry.name.endsWith('.json')) {
			continue;
		}

		Object.assign(merged, readJson(entryPath));
	}

	return sortObjectKeys(merged);
}

/**
 * Merge root-level theme-config/*.json files (e.g. template-parts, custom-templates).
 *
 * @return {Object} Merged root-level keys from JSON files.
 */
function mergeRootJsonFiles() {
	const merged = {};
	const entries = fs
		.readdirSync(CONFIG_DIR, { withFileTypes: true })
		.filter(
			(entry) =>
				entry.isFile() &&
				entry.name.endsWith('.json') &&
				!entry.name.startsWith('.')
		)
		.sort((a, b) => a.name.localeCompare(b.name));

	for (const entry of entries) {
		Object.assign(
			merged,
			sortObjectKeys(readJson(path.join(CONFIG_DIR, entry.name)))
		);
	}

	return merged;
}

/**
 * Build the merged theme.json object from theme-config/.
 * Order: manual root → settings → styles → other root JSON files.
 *
 * @return {Object} Complete theme.json object.
 */
function buildThemeJson() {
	if (!fs.existsSync(CONFIG_DIR)) {
		throw new Error(`theme-config directory not found: ${CONFIG_DIR}`);
	}

	const finalOutput = {
		...MANUAL_ROOT,
	};

	const settingsDir = path.join(CONFIG_DIR, 'settings');
	if (fs.existsSync(settingsDir)) {
		finalOutput.settings = mergeDirectory(settingsDir);
	}

	const stylesDir = path.join(CONFIG_DIR, 'styles');
	if (fs.existsSync(stylesDir)) {
		finalOutput.styles = mergeDirectory(stylesDir);
	}

	Object.assign(finalOutput, mergeRootJsonFiles());

	return finalOutput;
}

/**
 * Serialize theme.json with tab indentation and trailing newline.
 *
 * @param {Object} themeJson Theme.json object to serialize.
 * @return {string} Pretty-printed JSON string.
 */
function stringifyThemeJson(themeJson) {
	return JSON.stringify(themeJson, null, '\t') + '\n';
}

/**
 * Merge theme-config into theme.json (write mode).
 *
 * @return {{ outputPath: string, content: string }} Written path and content.
 */
function mergeThemeJson() {
	const content = stringifyThemeJson(buildThemeJson());
	fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
	return { outputPath: OUTPUT_FILE, content };
}

/**
 * Check that committed theme.json matches a fresh merge (no write).
 *
 * @return {{ ok: boolean, content: string, reason?: string }} Check result.
 */
function checkThemeJson() {
	const content = stringifyThemeJson(buildThemeJson());

	if (!fs.existsSync(OUTPUT_FILE)) {
		return { ok: false, content, reason: 'theme.json does not exist' };
	}

	const committed = fs.readFileSync(OUTPUT_FILE, 'utf8');
	if (committed === content) {
		return { ok: true, content };
	}

	return {
		ok: false,
		content,
		reason: 'theme.json is out of sync with theme-config/',
	};
}

function printUnifiedDiff(expected, actual) {
	const expectedLines = expected.split('\n');
	const actualLines = actual.split('\n');
	const max = Math.max(expectedLines.length, actualLines.length);
	let printed = 0;

	// @debug-ignore — CLI status output for theme-json:check
	console.error('--- theme.json (committed)');
	// @debug-ignore — CLI status output for theme-json:check
	console.error('+++ theme.json (from theme-config)');

	for (let i = 0; i < max && printed < 80; i++) {
		const a = actualLines[i];
		const e = expectedLines[i];
		if (a === e) {
			continue;
		}
		if (e !== undefined) {
			// @debug-ignore — CLI status output for theme-json:check
			console.error(`- ${e}`);
			printed++;
		}
		if (a !== undefined) {
			// @debug-ignore — CLI status output for theme-json:check
			console.error(`+ ${a}`);
			printed++;
		}
	}

	if (printed >= 80) {
		// @debug-ignore — CLI status output for theme-json:check
		console.error('… (diff truncated)');
	}
}

function main() {
	const checkMode = process.argv.includes('--check');

	try {
		if (checkMode) {
			const result = checkThemeJson();
			if (result.ok) {
				// @debug-ignore — CLI status output for theme-json:check
				console.log('✅ theme.json matches theme-config/');
				process.exit(0);
			}

			// @debug-ignore — CLI status output for theme-json:check
			console.error(`❌ ${result.reason}`);
			// @debug-ignore — CLI status output for theme-json:check
			console.error(
				'Run `npm run theme-json:merge` and commit the updated theme.json.'
			);

			if (fs.existsSync(OUTPUT_FILE)) {
				printUnifiedDiff(
					fs.readFileSync(OUTPUT_FILE, 'utf8'),
					result.content
				);
			}

			process.exit(1);
		}

		const { outputPath } = mergeThemeJson();
		// @debug-ignore — CLI status output for theme-json:merge
		console.log(`✅ theme.json successfully merged: ${outputPath}`);
	} catch (error) {
		// @debug-ignore — CLI status output for theme-json:merge
		console.error(`❌ theme.json merge failed: ${error.message}`);
		process.exit(1);
	}
}

module.exports = {
	THEME_ROOT,
	CONFIG_DIR,
	OUTPUT_FILE,
	buildThemeJson,
	mergeThemeJson,
	checkThemeJson,
	stringifyThemeJson,
	mergeDirectory,
	sortObjectKeys,
	compareThemeJsonKeys,
	themeJsonKeyRank,
};

if (require.main === module) {
	main();
}
