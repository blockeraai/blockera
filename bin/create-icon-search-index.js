/**
 * External dependencies
 */
const path = require('path');
const { spawn } = require('child_process');

// Run both scripts sequentially without requiring a script type argument
const scriptPaths = [
	path.resolve(__dirname, './create-icon-search-index-1.js'),
	path.resolve(__dirname, './create-icon-search-index-2.js'),
];

// Pass through any additional args (if provided)
const remainingArgs = process.argv.slice(2);

function runScript(scriptPath) {
	return new Promise((resolve) => {
		const child = spawn('node', [scriptPath, ...remainingArgs], {
			stdio: 'inherit',
		});
		child.on('exit', (code) => resolve(code));
	});
}

(async () => {
	for (const scriptPath of scriptPaths) {
		const code = await runScript(scriptPath);
		if (code !== 0) {
			process.exit(code);
		}
	}
	process.exit(0);
})();
