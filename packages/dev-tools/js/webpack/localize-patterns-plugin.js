/**
 * Webpack plugin: localize patterns PHP files on each compile,
 * and register the patterns directories as watch dependencies for `wp-scripts start`.
 *
 * Reads theme-root `.patterns.config.js`. No-ops when the configured patterns
 * directories have no PHP files.
 */

const fs = require('fs');
const path = require('path');

/**
 * @param {Object} [overrides] Optional config overrides.
 */
class LocalizePatternsWebpackPlugin {
	constructor(overrides = {}) {
		this.overrides = overrides;
	}

	apply(compiler) {
		const pluginName = 'LocalizePatternsWebpackPlugin';

		let cachedConfig = null;

		const getConfig = () => {
			const {
				loadPatternsConfig,
			} = require('../patterns/load-patterns-config');
			cachedConfig = loadPatternsConfig({
				...this.overrides,
				quiet: true,
			});
			return cachedConfig;
		};

		compiler.hooks.beforeCompile.tapPromise(pluginName, async () => {
			const {
				hasPatternPhpFiles,
				localizePatterns,
			} = require('../../../utils/js/patterns/localize-patterns');

			let config;
			try {
				config = getConfig();
			} catch (error) {
				// Config is required for this theme workflow; surface clearly.
				compiler
					.getInfrastructureLogger(pluginName)
					.error(error.message);
				throw error;
			}

			if (!hasPatternPhpFiles(config.patternsDirs)) {
				return;
			}

			await localizePatterns(config);
		});

		compiler.hooks.afterCompile.tap(pluginName, (compilation) => {
			let config;
			try {
				config = cachedConfig || getConfig();
			} catch (error) {
				return;
			}

			compilation.fileDependencies.add(config.configPath);

			for (const patternsDir of config.patternsDirs) {
				if (!fs.existsSync(patternsDir)) {
					continue;
				}

				compilation.contextDependencies.add(patternsDir);
				addPatternPhpDependencies(compilation, patternsDir);
			}
		});
	}
}

/**
 * Recursively register pattern PHP files for webpack watch.
 *
 * @param {import('webpack').Compilation} compilation Webpack compilation.
 * @param {string} dir Directory to watch.
 */
function addPatternPhpDependencies(compilation, dir) {
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
			addPatternPhpDependencies(compilation, entryPath);
			continue;
		}

		if (entry.isFile() && entry.name.endsWith('.php')) {
			compilation.fileDependencies.add(entryPath);
		}
	}
}

/**
 * Whether the product has pattern PHP files per `.patterns.config.js`.
 *
 * @param {Object} [overrides] Optional overrides.
 * @return {boolean} True when pattern PHP files exist.
 */
function hasConfiguredPatterns(overrides = {}) {
	try {
		const {
			loadPatternsConfig,
		} = require('../patterns/load-patterns-config');
		const {
			hasPatternPhpFiles,
		} = require('../../../utils/js/patterns/localize-patterns');
		const config = loadPatternsConfig({ ...overrides, quiet: true });
		return hasPatternPhpFiles(config.patternsDirs);
	} catch (error) {
		return false;
	}
}

module.exports = LocalizePatternsWebpackPlugin;
module.exports.hasConfiguredPatterns = hasConfiguredPatterns;
