// @flow

/**
 * Usage examples for the missing icons functions
 */
import {
	getMissingIcons,
	getAllMissingIcons,
	getMissingIconsDetails,
	generateSearchDataTemplate,
	logMissingIcons,
} from './icons';

// Example 1: Get missing icons for a specific library
console.log('=== Example 1: Get missing icons for WordPress library ===');
const wpMissingIcons = getMissingIcons('wp');
console.log('Missing WordPress icons:', wpMissingIcons);

// Example 2: Get missing icons for all libraries
console.log('\n=== Example 2: Get missing icons for all libraries ===');
const allMissingIcons = getAllMissingIcons();
console.log('All missing icons:', allMissingIcons);

// Example 3: Get detailed information about missing icons
console.log('\n=== Example 3: Get detailed information for Social library ===');
const socialMissingDetails = getMissingIconsDetails('social');
console.log('Social library missing details:', socialMissingDetails);

// Example 4: Generate a search data template
console.log(
	'\n=== Example 4: Generate search data template for Cursor library ==='
);
const cursorTemplate = generateSearchDataTemplate('cursor');
console.log('Cursor library template:');
console.log(cursorTemplate);

// Example 5: Log missing icons information
console.log('\n=== Example 5: Log missing icons for specific library ===');
logMissingIcons('blockera');

console.log('\n=== Example 6: Log missing icons for all libraries ===');
logMissingIcons();

// Example 6: Check if a specific library has missing icons
console.log('\n=== Example 7: Check specific library status ===');
const libraries = ['wp', 'blockera', 'cursor', 'social'];

libraries.forEach((libraryId) => {
	const missingCount = getMissingIcons(libraryId).length;
	const status =
		missingCount === 0 ? '✅ Complete' : `❌ ${missingCount} missing`;
	console.log(`${libraryId}: ${status}`);
});
