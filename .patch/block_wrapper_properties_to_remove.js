#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Exception list - CSS properties to exclude from the final list
 * Add properties here that should be filtered out
 */
const EXCEPTION_LIST = [
	'grid-template-columns',
	'math-depth',
	// Add your exceptions here, for example:
	// 'background',
	// 'color',
	// 'display',
];

/**
 * Recursively find all frontend.css files in the tests directory
 */
function findFrontendCssFiles(dir, fileList = []) {
	try {
		const files = fs.readdirSync(dir);

		files.forEach((file) => {
			const filePath = path.join(dir, file);

			try {
				const stat = fs.statSync(filePath);

				if (stat.isDirectory()) {
					findFrontendCssFiles(filePath, fileList);
				} else if (file === 'frontend.css') {
					fileList.push(filePath);
				}
			} catch (error) {
				// Skip files/directories we can't access
				// console.warn(`Skipping ${filePath}: ${error.message}`);
			}
		});
	} catch (error) {
		// Skip directories we can't access
		// console.warn(`Skipping directory ${dir}: ${error.message}`);
	}

	return fileList;
}

/**
 * Extract CSS properties from :where() selectors
 * Handles nested braces and media queries
 */
function extractWhereProperties(cssContent) {
	const properties = new Set();

	// Match :where(...) { ... } blocks
	// This regex matches :where(selector) { properties }
	// We need to handle nested braces properly
	const wherePattern = /:where\([^)]+\)\s*\{/g;

	let match;
	while ((match = wherePattern.exec(cssContent)) !== null) {
		const startPos = match.index + match[0].length;

		// Find the matching closing brace, handling nested braces
		let braceCount = 1;
		let pos = startPos;
		let endPos = -1;

		while (pos < cssContent.length && braceCount > 0) {
			if (cssContent[pos] === '{') {
				braceCount++;
			} else if (cssContent[pos] === '}') {
				braceCount--;
				if (braceCount === 0) {
					endPos = pos;
					break;
				}
			}
			pos++;
		}

		if (endPos > startPos) {
			const propertiesBlock = cssContent.substring(startPos, endPos);

			// Extract individual properties (property: value;)
			// Handle properties that might span multiple lines
			const propertyPattern = /([a-zA-Z-][a-zA-Z0-9-]*)\s*:/g;
			let propMatch;
			while (
				(propMatch = propertyPattern.exec(propertiesBlock)) !== null
			) {
				const property = propMatch[1].trim();
				if (property) {
					properties.add(property);
				}
			}
		}
	}

	return properties;
}

/**
 * Main function
 */
function main() {
	const testsDir = path.join(__dirname, '../');
	const cssFiles = findFrontendCssFiles(testsDir);

	if (cssFiles.length === 0) {
		console.log('No frontend.css files found in tests directory');
		process.exit(1);
	}

	console.log(`Found ${cssFiles.length} frontend.css files\n`);

	const allProperties = new Set();

	cssFiles.forEach((file) => {
		try {
			const content = fs.readFileSync(file, 'utf8');
			const properties = extractWhereProperties(content);

			properties.forEach((prop) => allProperties.add(prop));

			if (properties.size > 0) {
				console.log(`${file}: Found ${properties.size} properties`);
			}
		} catch (error) {
			console.error(`Error reading ${file}:`, error.message);
		}
	});

	// Convert to sorted array
	const allPropertiesArray = Array.from(allProperties).sort();

	// Separate exceptions and filtered properties, both sorted
	const exceptions = allPropertiesArray
		.filter((prop) => EXCEPTION_LIST.includes(prop))
		.sort();
	const filteredProperties = allPropertiesArray
		.filter((prop) => !EXCEPTION_LIST.includes(prop))
		.sort();

	// Display exception list
	console.log(`\n=== Exception List ===`);
	if (exceptions.length > 0) {
		console.log(`Total: ${exceptions.length} exceptions\n`);
		exceptions.forEach((prop) => {
			console.log(prop);
		});
	} else {
		console.log(
			`No exceptions found (exception list is empty or no matches)\n`
		);
	}

	// Display exception list configuration
	console.log(`\n=== Exception List Configuration ===`);
	if (EXCEPTION_LIST.length > 0) {
		console.log(`Configured exceptions: ${EXCEPTION_LIST.length}\n`);
		EXCEPTION_LIST.forEach((prop) => {
			const found = exceptions.includes(prop);
			console.log(`  ${prop} ${found ? '✓ (found)' : '✗ (not found)'}`);
		});
	} else {
		console.log(`No exceptions configured in EXCEPTION_LIST\n`);
	}

	// Display filtered properties (final list)
	console.log(
		`\n=== Unique CSS Properties in :where() selectors (Filtered) ===`
	);
	console.log(
		`Total: ${filteredProperties.length} unique properties (${allPropertiesArray.length} total - ${exceptions.length} exceptions)\n`
	);

	filteredProperties.forEach((prop) => {
		console.log(prop);
	});

	// Also output as JSON array for programmatic use
	console.log(`\n=== JSON Array (Filtered) ===`);
	console.log(JSON.stringify(filteredProperties, null, 2));

	// Also output exceptions as JSON
	if (exceptions.length > 0) {
		console.log(`\n=== JSON Array (Exceptions) ===`);
		console.log(JSON.stringify(exceptions, null, 2));
	}
}

main();
