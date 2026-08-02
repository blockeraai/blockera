/**
 * Webpack plugin: merge theme-config/ → theme.json on each compile,
 * and register theme-config as a watch dependency for `wp-scripts start`.
 *
 * No-ops when the product root has no `theme-config/` directory (plugins).
 */

const fs = require('fs');
const path = require('path');

const PRODUCT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const CONFIG_DIR = path.join(PRODUCT_ROOT, 'theme-config');

/**
 * @return {boolean} Whether the product root has a theme-config directory.
 */
function hasThemeConfig() {
	return fs.existsSync(CONFIG_DIR);
}

/**
 * Lazy-load merge helpers only when theme-config exists.
 *
 * @return {{ mergeThemeJson: Function }} Merge helpers module exports.
 */
function loadMergeThemeJson() {
	return require('../theme-json/merge-theme-json');
}

/**
 * Recursively register theme-config dirs/files so webpack watch rebuilds on edits.
 *
 * @param {import('webpack').Compilation} compilation Webpack compilation.
 * @param {string} dir Directory to watch.
 */
function addThemeConfigDependencies(compilation, dir) {
	compilation.contextDependencies.add(dir);

	let entries;
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch (error) {
		return;
	}

	for (const entry of entries) {
		if (entry.name.startsWith('.')) {
			continue;
		}

		const entryPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			addThemeConfigDependencies(compilation, entryPath);
			continue;
		}

		if (entry.isFile() && entry.name.endsWith('.json')) {
			compilation.fileDependencies.add(entryPath);
		}
	}
}

class MergeThemeJsonWebpackPlugin {
	apply(compiler) {
		if (!hasThemeConfig()) {
			return;
		}

		const pluginName = 'MergeThemeJsonWebpackPlugin';

		compiler.hooks.beforeCompile.tap(pluginName, () => {
			const { mergeThemeJson } = loadMergeThemeJson();
			mergeThemeJson();
		});

		compiler.hooks.afterCompile.tap(pluginName, (compilation) => {
			addThemeConfigDependencies(compilation, CONFIG_DIR);
		});
	}
}

module.exports = MergeThemeJsonWebpackPlugin;
module.exports.hasThemeConfig = hasThemeConfig;
