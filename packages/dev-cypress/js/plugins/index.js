const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

const BLOCKERA_PLUGIN_ROOT = path.resolve(__dirname, '../../../..');
const WP_PLUGIN_SLUG = path.basename(BLOCKERA_PLUGIN_ROOT);
const WP_ENV_BIN = path.join(
	BLOCKERA_PLUGIN_ROOT,
	'node_modules',
	'.bin',
	'wp-env'
);
const WP_EVAL_TIMEOUT_MS = 120000;

/**
 * @return {string}
 */
function getWpEnvHome() {
	return process.env.WP_ENV_HOME || path.join(os.homedir(), '.wp-env');
}

/**
 * Resolve wp-env mu-plugins directory for this blockera project (host path).
 *
 * @return {string|null}
 */
function resolveWpEnvMuPluginsDir() {
	const configFilePath = path.join(BLOCKERA_PLUGIN_ROOT, '.wp-env.json');
	if (!fs.existsSync(configFilePath)) {
		return null;
	}

	const envHash = crypto
		.createHash('md5')
		.update(configFilePath)
		.digest('hex');
	const muDir = path.join(
		getWpEnvHome(),
		envHash,
		'wordpress-latest',
		'wp-content',
		'mu-plugins'
	);

	fs.mkdirSync(muDir, { recursive: true });
	return muDir;
}

/**
 * @param {string} muPluginPath
 * @param {string|null} targetName
 * @return {string}
 */
function getMuPluginTargetName(muPluginPath, targetName = null) {
	if (targetName) {
		return targetName;
	}
	const pathParts = muPluginPath.split('/');
	const folderName = pathParts[pathParts.length - 2] || 'mu-plugin';
	return `blockera-test-${folderName}.php`;
}

/**
 * @param {string} filePath
 * @return {string}
 */
function fileHash(filePath) {
	return crypto
		.createHash('md5')
		.update(fs.readFileSync(filePath))
		.digest('hex');
}

/**
 * Escape single quotes for shell: ' becomes '\''
 *
 * @param {string} phpCode
 * @return {string}
 */
function escapePhpForShell(phpCode) {
	return phpCode.replace(/'/g, "'\\''");
}

/**
 * @param {string} stdout
 * @return {string}
 */
function parseWpEvalStdout(stdout) {
	const known =
		/(already_active|needs_copy|source_missing|installed|not_installed|deactivated|deactivate_skip|verified|missing|hash_mismatch|forced_copy)/;
	const match = String(stdout).match(known);

	return match ? match[1] : String(stdout).trim();
}

/**
 * CI-visible mu-plugin diagnostics (Node stdout → GitHub Actions / Cypress plugin log).
 *
 * @param {string} event
 * @param {Record<string, unknown>} [details]
 */
function logMuPlugin(event, details = {}) {
	const parts = [`[blockera:mu-plugin] ${event}`];

	for (const [key, value] of Object.entries(details)) {
		if (value !== undefined && value !== null && value !== '') {
			parts.push(`${key}=${String(value)}`);
		}
	}

	// @debug-ignore
	console.log(parts.join(' | '));
}

/**
 * Run PHP inside the wp-env CLI container.
 * Uses the local wp-env binary — never `npx`, which breaks inside Cypress plugin
 * processes (esbuild platform mismatch when Cypress runs x64 Node on arm64).
 *
 * @param {string} phpCode
 * @return {string}
 */
function runWpEval(phpCode) {
	if (!fs.existsSync(WP_ENV_BIN)) {
		throw new Error(
			`wp-env binary not found at ${WP_ENV_BIN}. Run npm install in the plugin root.`
		);
	}

	const escaped = escapePhpForShell(phpCode);
	const command = `"${WP_ENV_BIN}" run cli -- wp eval '${escaped}'`;

	try {
		return parseWpEvalStdout(
			execSync(command, {
				cwd: BLOCKERA_PLUGIN_ROOT,
				encoding: 'utf8',
				timeout: WP_EVAL_TIMEOUT_MS,
				stdio: ['pipe', 'pipe', 'pipe'],
			})
		);
	} catch (error) {
		const detail = [error.message, error.stderr, error.stdout]
			.filter(Boolean)
			.join('\n');
		throw new Error(`wp eval failed: ${detail}`);
	}
}

/**
 * Bust Blockera / core theme.json static caches after MU-plugin changes (CI production builds cache per worker).
 *
 * @return {{ ok: boolean, message: string }}
 */
function cleanJsonResolverThemeCache() {
	// Single backslashes in PHP source; JS template literals need one extra escape per `\`.
	const php = `if (class_exists('Blockera\\Setup\\Compatibility\\JSONResolver')) { \\Blockera\\Setup\\Compatibility\\JSONResolver::clean_cached_data(); echo 'blockera_cleaned'; } elseif (class_exists('WP_Theme_JSON_Resolver')) { \\WP_Theme_JSON_Resolver::clean_cached_data(); echo 'core_cleaned'; } else { echo 'skipped'; }`;

	try {
		const result = runWpEval(php);
		return {
			ok: true,
			message: result,
		};
	} catch (error) {
		return {
			ok: false,
			message: error?.message || String(error),
		};
	}
}

/**
 * @param {string} muPluginPath Relative to plugin root.
 * @param {string} targetName
 * @param {boolean} [force=false] Delete existing target before copy (retry path).
 * @return {{ ok: boolean, message: string }}
 */
function activateMuPluginOnHost(muPluginPath, targetName, force = false) {
	const sourceFile = path.join(BLOCKERA_PLUGIN_ROOT, muPluginPath);
	const muDir = resolveWpEnvMuPluginsDir();
	const targetFile = muDir ? path.join(muDir, targetName) : null;

	if (!muDir || !targetFile) {
		throw new Error('wp-env mu-plugins directory not found');
	}

	if (!fs.existsSync(sourceFile)) {
		throw new Error(
			`activate_failed: source not found for ${muPluginPath}`
		);
	}

	if (force && fs.existsSync(targetFile)) {
		fs.unlinkSync(targetFile);
	}

	if (
		!force &&
		fs.existsSync(targetFile) &&
		fileHash(sourceFile) === fileHash(targetFile)
	) {
		return {
			ok: true,
			message: `already_active:${targetFile}`,
		};
	}

	fs.copyFileSync(sourceFile, targetFile);
	return {
		ok: true,
		message: force
			? `forced_copy:${targetFile} from:${sourceFile}`
			: `activated:${targetFile} from:${sourceFile}`,
	};
}

/**
 * @param {string} targetName
 * @return {{ ok: boolean, message: string }}
 */
function deactivateMuPluginOnHost(targetName) {
	const muDir = resolveWpEnvMuPluginsDir();
	const targetFile = muDir ? path.join(muDir, targetName) : null;

	if (!targetFile) {
		throw new Error('wp-env mu-plugins directory not found');
	}

	if (!fs.existsSync(targetFile)) {
		return {
			ok: true,
			message: `deactivate_skip: not found ${targetFile}`,
		};
	}

	fs.unlinkSync(targetFile);
	return {
		ok: true,
		message: `deactivated:${targetFile}`,
	};
}

/**
 * @param {string} muPluginPath Relative to plugin root.
 * @param {string} targetName
 * @param {boolean} [force=false] Delete existing target before copy (retry path).
 * @return {{ ok: boolean, message: string }}
 */
function activateMuPluginInContainer(muPluginPath, targetName, force = false) {
	const sourceFile = path.join(BLOCKERA_PLUGIN_ROOT, muPluginPath);

	if (!fs.existsSync(sourceFile)) {
		throw new Error(
			`activate_failed: source not found for ${muPluginPath}`
		);
	}

	const forcePhp = force
		? `if (file_exists($targetFile)) { unlink($targetFile); } `
		: '';
	const skipIfActivePhp = force
		? ''
		: `if (file_exists($targetFile) && md5_file($targetFile) === md5_file($sourceFile)) { echo 'already_active'; exit(0); } `;
	const successToken = force ? 'forced_copy' : 'installed';

	const activatePhp = `if (!file_exists(WPMU_PLUGIN_DIR)) { wp_mkdir_p(WPMU_PLUGIN_DIR); } $sourceFile = ABSPATH . 'wp-content/plugins/${WP_PLUGIN_SLUG}/${muPluginPath}'; $targetFile = WPMU_PLUGIN_DIR . '/${targetName}'; if (!file_exists($sourceFile)) { echo 'source_missing'; exit(1); } ${forcePhp}${skipIfActivePhp}file_put_contents($targetFile, file_get_contents($sourceFile)); echo file_exists($targetFile) ? '${successToken}' : 'not_installed';`;
	const result = runWpEval(activatePhp);

	if (result === 'source_missing') {
		throw new Error(
			`activate_failed: source missing in container for ${muPluginPath}`
		);
	}

	if (result === 'already_active') {
		return {
			ok: true,
			message: `already_active:${targetName}`,
		};
	}

	if (result !== 'installed' && result !== 'forced_copy') {
		throw new Error(
			`activate_verify_failed: ${targetName} (got: ${result})`
		);
	}

	return {
		ok: true,
		message:
			result === 'forced_copy'
				? `forced_copy:${targetName} from:${sourceFile}`
				: `activated:${targetName} from:${sourceFile}`,
	};
}

/**
 * @param {string} muPluginPath Relative to plugin root.
 * @param {string} targetName
 * @return {{ ok: boolean, message: string }}
 */
function verifyMuPluginOnHost(muPluginPath, targetName) {
	const sourceFile = path.join(BLOCKERA_PLUGIN_ROOT, muPluginPath);
	const muDir = resolveWpEnvMuPluginsDir();
	const targetFile = muDir ? path.join(muDir, targetName) : null;

	if (!targetFile) {
		return {
			ok: false,
			message: 'verify_failed: wp-env mu-plugins directory not found',
		};
	}

	if (!fs.existsSync(sourceFile)) {
		return {
			ok: false,
			message: `verify_failed: source not found for ${muPluginPath}`,
		};
	}

	if (!fs.existsSync(targetFile)) {
		return {
			ok: false,
			message: `missing:${targetFile}`,
		};
	}

	if (fileHash(sourceFile) !== fileHash(targetFile)) {
		return {
			ok: false,
			message: `hash_mismatch:${targetFile}`,
		};
	}

	return {
		ok: true,
		message: `verified:${targetFile}`,
	};
}

/**
 * @param {string} muPluginPath Relative to plugin root.
 * @param {string} targetName
 * @return {{ ok: boolean, message: string }}
 */
function verifyMuPluginInContainer(muPluginPath, targetName) {
	const sourceFile = path.join(BLOCKERA_PLUGIN_ROOT, muPluginPath);

	if (!fs.existsSync(sourceFile)) {
		return {
			ok: false,
			message: `verify_failed: source not found for ${muPluginPath}`,
		};
	}

	const verifyPhp = `$sourceFile = ABSPATH . 'wp-content/plugins/${WP_PLUGIN_SLUG}/${muPluginPath}'; $targetFile = WPMU_PLUGIN_DIR . '/${targetName}'; if (!file_exists($targetFile)) { echo 'missing'; exit(0); } if (!file_exists($sourceFile)) { echo 'source_missing'; exit(1); } echo md5_file($targetFile) === md5_file($sourceFile) ? 'verified' : 'hash_mismatch';`;
	const result = runWpEval(verifyPhp);

	if (result === 'source_missing') {
		return {
			ok: false,
			message: `verify_failed: source missing in container for ${muPluginPath}`,
		};
	}

	if (result === 'missing') {
		return {
			ok: false,
			message: `missing:${targetName}`,
		};
	}

	if (result === 'hash_mismatch') {
		return {
			ok: false,
			message: `hash_mismatch:${targetName}`,
		};
	}

	if (result !== 'verified') {
		return {
			ok: false,
			message: `verify_failed:${targetName} (got: ${result})`,
		};
	}

	return {
		ok: true,
		message: `verified:${targetName} from:${sourceFile}`,
	};
}

/**
 * @param {string} targetName
 * @return {{ ok: boolean, message: string }}
 */
function deactivateMuPluginInContainer(targetName) {
	const result = runWpEval(
		`$targetFile = WPMU_PLUGIN_DIR . '/${targetName}'; if (file_exists($targetFile)) { unlink($targetFile); echo 'deactivated'; } else { echo 'deactivate_skip'; }`
	);

	return {
		ok: true,
		message: `${result}:${targetName}`,
	};
}

/**
 * Host copy is fast and avoids subprocess issues in the Cypress plugin process.
 * Container copy is used on CI where host ~/.wp-env paths are unreliable.
 *
 * @return {boolean}
 */
function shouldUseHostMuPlugins() {
	return !process.env.CI && Boolean(resolveWpEnvMuPluginsDir());
}

/**
 * @return {'host'|'container'}
 */
function getMuPluginTransport() {
	return shouldUseHostMuPlugins() ? 'host' : 'container';
}

module.exports = (on, config, testingType = config.testingType || 'e2e') => {
	if (testingType !== 'e2e') {
		return;
	}

	const options = {
		webpackOptions: require(
			path.resolve(__dirname, '../webpack.config.js')
		),
		watchOptions: {},
	};

	on('file:preprocessor', webpack(options));

	require('cypress-log-to-output').install(
		on,
		(type, event) => event.level === 'error' || event.type === 'error'
	);

	on('task', {
		logToCi(message) {
			// @debug-ignore
			console.log(String(message));
			return null;
		},
		muPluginActivate({
			muPluginPath,
			targetName,
			force = false,
			attempt = 1,
			maxAttempts = 1,
		}) {
			const resolvedTarget = getMuPluginTargetName(
				muPluginPath,
				targetName
			);
			const transport = getMuPluginTransport();

			logMuPlugin('activate:start', {
				transport,
				attempt,
				maxAttempts,
				force,
				source: muPluginPath,
				target: resolvedTarget,
				ci: Boolean(process.env.CI),
			});

			let result;

			try {
				if (transport === 'host') {
					result = activateMuPluginOnHost(
						muPluginPath,
						resolvedTarget,
						force
					);
				} else {
					result = activateMuPluginInContainer(
						muPluginPath,
						resolvedTarget,
						force
					);
				}
			} catch (error) {
				logMuPlugin('activate:error', {
					transport,
					attempt,
					maxAttempts,
					target: resolvedTarget,
					error: error?.message || String(error),
				});
				throw error;
			}

			logMuPlugin('activate:done', {
				transport,
				attempt,
				maxAttempts,
				target: resolvedTarget,
				ok: result?.ok,
				message: result?.message,
			});

			const cacheResult = cleanJsonResolverThemeCache();
			logMuPlugin(
				cacheResult.ok ? 'cache:cleared' : 'cache:clear_failed',
				{
					transport,
					target: resolvedTarget,
					message: cacheResult.message,
				}
			);

			return result;
		},
		cleanJsonResolverCache() {
			const cacheResult = cleanJsonResolverThemeCache();
			logMuPlugin(
				cacheResult.ok ? 'cache:cleared' : 'cache:clear_failed',
				{
					message: cacheResult.message,
				}
			);
			return cacheResult;
		},
		muPluginVerify({
			muPluginPath,
			targetName,
			attempt = 1,
			maxAttempts = 1,
		}) {
			const resolvedTarget = getMuPluginTargetName(
				muPluginPath,
				targetName
			);
			const transport = getMuPluginTransport();

			logMuPlugin('verify:start', {
				transport,
				attempt,
				maxAttempts,
				source: muPluginPath,
				target: resolvedTarget,
				ci: Boolean(process.env.CI),
			});

			const result =
				transport === 'host'
					? verifyMuPluginOnHost(muPluginPath, resolvedTarget)
					: verifyMuPluginInContainer(muPluginPath, resolvedTarget);

			logMuPlugin(result?.ok ? 'verify:ok' : 'verify:failed', {
				transport,
				attempt,
				maxAttempts,
				target: resolvedTarget,
				message: result?.message,
			});

			return result;
		},
		muPluginDeactivate({ muPluginPath, targetName }) {
			const resolvedTarget = getMuPluginTargetName(
				muPluginPath,
				targetName
			);
			const transport = getMuPluginTransport();

			logMuPlugin('deactivate:start', {
				transport,
				target: resolvedTarget,
				ci: Boolean(process.env.CI),
			});

			const result =
				transport === 'host'
					? deactivateMuPluginOnHost(resolvedTarget)
					: deactivateMuPluginInContainer(resolvedTarget);

			logMuPlugin('deactivate:done', {
				transport,
				target: resolvedTarget,
				message: result?.message,
			});

			return result;
		},
	});

	on('before:browser:launch', (browser = {}, launchOptions) => {
		if (browser.family === 'chromium' && browser.name !== 'electron') {
			// Disable GPU acceleration which can help in some CI environments
			launchOptions.args.push('--disable-gpu');
			// Increase shared memory usage in Docker or constrained environments
			launchOptions.args.push('--disable-dev-shm-usage');
		}
		return launchOptions;
	});
};
