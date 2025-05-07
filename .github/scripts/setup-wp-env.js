const fs = require('fs');
require('dotenv').config();

// Only run this in local development
if (process.env.CI) {
	process.exit(0);
}

// Get the wp-env config from .env file
const wpEnvConfig = process.env.WP_ENV_CONFIG;

// If no config specified in .env, use base config
const configPath =
	(wpEnvConfig && `.github/wp-env-configs/${wpEnvConfig}.json`) ||
	'.github/wp-env-configs/development.json';

// Check if the specified config exists
if (wpEnvConfig && !fs.existsSync(configPath)) {
	console.error(`❌ Error: Configuration file ${configPath} not found`);
	process.exit(1);
}

// Copy the config to .wp-env.json
fs.copyFileSync(configPath, '.wp-env.json');

console.log(`👉 wp-env configuration: ${configPath} \n`);
