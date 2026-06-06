/**
 * Validates @untitledui/icons package exports.
 * Icons are imported in bulk from the npm package (see icons.js).
 */
const untitleduiIcons = require('@untitledui/icons');

const iconNames = Object.keys(untitleduiIcons).filter(
	(key) => typeof untitleduiIcons[key] === 'function'
);

console.log(`@untitledui/icons exports ${iconNames.length} icon components.`);
