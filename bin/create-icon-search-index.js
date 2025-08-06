/**
 * External dependencies
 */
const path = require('path');
const { spawn } = require('child_process');

const scriptType = process.argv[2];

if (!scriptType) {
	console.error('Error: Script type must be provided as an argument.');
	console.error('Usage: node create-icon-search-index.js <all|fontawesome>');
	process.exit(1);
}

const scriptPath = path.resolve(
	__dirname,
	scriptType === 'all'
		? './create-search-all-libraries-index.js'
		: './create-search-fontawesome-index.js'
);

// Get remaining arguments to pass through
const remainingArgs = process.argv.slice(3);

// Spawn the appropriate script
const child = spawn('node', [scriptPath, ...remainingArgs], {
	stdio: 'inherit',
});

child.on('exit', (code) => {
	process.exit(code);
});
