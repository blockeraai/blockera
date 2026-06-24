const webpack = require('@cypress/webpack-preprocessor');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const BLOCKERA_PLUGIN_ROOT = path.resolve(__dirname, '../../../..');
const WP_PLUGIN_SLUG = 'blockera';
const WP_EVAL_TIMEOUT_MS = 120000;

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
		/(already_active|needs_copy|source_missing|installed|not_installed|deactivated|deactivate_skip)/;
	const match = String(stdout).match(known);

	return match ? match[1] : String(stdout).trim();
}

/**
 * Run PHP inside the wp-env CLI container (same approach as Playwright).
 * Host filesystem copies to ~/.wp-env/.../wordpress-latest/mu-plugins are unreliable on CI.
 *
 * @param {string} phpCode
 * @return {string}
 */
function runWpEval(phpCode) {
	const escaped = escapePhpForShell(phpCode);
	const command = `npx wp-env run cli -- wp eval '${escaped}'`;

	return parseWpEvalStdout(
		execSync(command, {
			cwd: BLOCKERA_PLUGIN_ROOT,
			encoding: 'utf8',
			timeout: WP_EVAL_TIMEOUT_MS,
			stdio: ['pipe', 'pipe', 'pipe'],
		})
	);
}

/**
 * @param {string} muPluginPath Relative to plugin root.
 * @param {string} targetName
 * @return {{ ok: boolean, message: string }}
 */
function activateMuPluginInContainer(muPluginPath, targetName) {
	const sourceFile = path.join(BLOCKERA_PLUGIN_ROOT, muPluginPath);

	if (!fs.existsSync(sourceFile)) {
		throw new Error(
			`activate_failed: source not found for ${muPluginPath}`
		);
	}

	const checkPhp = `$target = WPMU_PLUGIN_DIR . '/${targetName}'; if (!file_exists($target)) { echo 'needs_copy'; exit(0); } $source = ABSPATH . 'wp-content/plugins/${WP_PLUGIN_SLUG}/${muPluginPath}'; if (!file_exists($source)) { echo 'source_missing'; exit(1); } echo md5_file($target) === md5_file($source) ? 'already_active' : 'needs_copy';`;
	const checkResult = runWpEval(checkPhp);

	if (checkResult === 'already_active') {
		return {
			ok: true,
			message: `already_active:${targetName}`,
		};
	}

	if (checkResult === 'source_missing') {
		throw new Error(
			`activate_failed: source missing in container for ${muPluginPath}`
		);
	}

	const activatePhp = `if (!file_exists(WPMU_PLUGIN_DIR)) { wp_mkdir_p(WPMU_PLUGIN_DIR); } $sourceFile = ABSPATH . 'wp-content/plugins/${WP_PLUGIN_SLUG}/${muPluginPath}'; $targetFile = WPMU_PLUGIN_DIR . '/${targetName}'; if (!file_exists($sourceFile)) { fwrite(STDERR, 'source missing: ' . $sourceFile); exit(1); } file_put_contents($targetFile, file_get_contents($sourceFile));`;
	runWpEval(activatePhp);

	const verifyResult = runWpEval(
		`echo file_exists(WPMU_PLUGIN_DIR . '/${targetName}') ? 'installed' : 'not_installed';`
	);

	if (verifyResult !== 'installed') {
		throw new Error(
			`activate_verify_failed: ${targetName} (got: ${verifyResult})`
		);
	}

	return {
		ok: true,
		message: `activated:${targetName} from:${sourceFile}`,
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

			return activateMuPluginInContainer(muPluginPath, resolvedTarget);
		},
		muPluginDeactivate({ muPluginPath, targetName }) {
			const resolvedTarget = getMuPluginTargetName(
				muPluginPath,
				targetName
			);

			return deactivateMuPluginInContainer(resolvedTarget);
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
