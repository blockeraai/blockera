const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');

const BLOCKERA_PLUGIN_ROOT = path.resolve(__dirname, '../../../..');

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

module.exports = (on, config) => {
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
		muPluginActivate({ muPluginPath, targetName }) {
			const resolvedTarget = getMuPluginTargetName(
				muPluginPath,
				targetName
			);
			const sourceFile = path.join(BLOCKERA_PLUGIN_ROOT, muPluginPath);
			const muDir = resolveWpEnvMuPluginsDir();
			const targetFile = muDir ? path.join(muDir, resolvedTarget) : null;

			if (!muDir || !targetFile) {
				throw new Error('wp-env mu-plugins directory not found');
			}

			if (!fs.existsSync(sourceFile)) {
				throw new Error(
					`activate_failed: source not found for ${muPluginPath}`
				);
			}

			if (
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
				message: `activated:${targetFile} from:${sourceFile}`,
			};
		},
		muPluginDeactivate({ muPluginPath, targetName }) {
			const resolvedTarget = getMuPluginTargetName(
				muPluginPath,
				targetName
			);
			const muDir = resolveWpEnvMuPluginsDir();
			const targetFile = muDir ? path.join(muDir, resolvedTarget) : null;

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
