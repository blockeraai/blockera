// @flow

/**
 * Internal dependencies
 */
// Import all icon libraries and their search data
import { WPIcons } from '../library-wp/icons';
import WPSearchData from '../library-wp/search-data.json';

import { BlockeraIcons } from '../library-blockera/icons';
import BlockeraSearchData from '../library-blockera/search-data.json';

import { CursorIcons } from '../library-cursor/icons';
import CursorSearchData from '../library-cursor/search-data.json';

import { BrandsIcons } from '../library-brands/icons';
import BrandsSearchData from '../library-brands/search-data.json';

import { FaRegularIcons } from '../library-faregular/icons';
import FaRegularSearchData from '../library-faregular/search-data.json';

import { FaSolidIcons } from '../library-fasolid/icons';
import FaSolidSearchData from '../library-fasolid/search-data.json';

import { FaBrandsIcons } from '../library-fabrands/icons';
import FaBrandsSearchData from '../library-fabrands/search-data.json';

// Import the libraries configuration
import searchLibraries from '../search-libraries.json';

/**
 * Library configurations mapping
 */
const libraryConfigs = {
	wp: {
		icons: WPIcons,
		searchData: WPSearchData,
		name: 'WordPress',
	},
	blockera: {
		icons: BlockeraIcons,
		searchData: BlockeraSearchData,
		name: 'Blockera',
	},
	cursor: {
		icons: CursorIcons,
		searchData: CursorSearchData,
		name: 'Cursor',
	},
	brands: {
		icons: BrandsIcons,
		searchData: BrandsSearchData,
		name: 'Brands',
	},
	faregular: {
		icons: FaRegularIcons,
		searchData: FaRegularSearchData,
		name: 'Font Awesome Regular',
	},
	fasolid: {
		icons: FaSolidIcons,
		searchData: FaSolidSearchData,
		name: 'Font Awesome Solid',
	},
	fabrands: {
		icons: FaBrandsIcons,
		searchData: FaBrandsSearchData,
		name: 'Font Awesome Brands',
	},
};

/**
 * Gets missing icons for a specific library
 *
 * @param {string} libraryId - The library ID (e.g., 'wp', 'blockera', 'cursor', 'social')
 * @return {Array} Array of missing icon names that need to be added to search data
 */
export function getMissingIcons(libraryId: string): Array<string> {
	const config = libraryConfigs[libraryId];

	if (!config) {
		console.warn(`⚠️  No configuration found for library: ${libraryId}`);
		return [];
	}

	// Get all exported icon names from the library
	const exportedIconNames = Object.keys(config.icons);

	// Get all icon names from search data
	const searchDataIconNames = config.searchData.map((item) => item.iconName);

	// Find icons that are exported but not in search data
	const missingIcons = exportedIconNames.filter(
		(iconName) => !searchDataIconNames.includes(iconName)
	);

	return missingIcons;
}

/**
 * Gets missing icons for all libraries
 *
 * @return {Object} Object with library IDs as keys and arrays of missing icon names as values
 */
export function getAllMissingIcons(): { [string]: Array<string> } {
	const result = {};

	searchLibraries.forEach((libraryId) => {
		result[libraryId] = getMissingIcons(libraryId);
	});

	return result;
}

/**
 * Gets detailed information about missing icons including their original component names
 *
 * @param {string} libraryId - The library ID
 * @return {Array} Array of objects with icon information
 */
export function getMissingIconsDetails(libraryId: string): Array<{
	iconName: string,
	originalComponentName: string,
	suggestedSearchData: Object,
}> {
	const config = libraryConfigs[libraryId];

	if (!config) {
		console.warn(`⚠️  No configuration found for library: ${libraryId}`);
		return [];
	}

	const missingIcons = getMissingIcons(libraryId);

	return missingIcons.map((iconName) => {
		// Try to find the original component name by reverse engineering the kebab case
		// This is a simple approach - for more complex cases, you might need to check the actual source
		const originalComponentName = iconName
			.split('-')
			.map((part, index) => {
				if (index === 0) {
					return part.charAt(0).toUpperCase() + part.slice(1);
				}
				return part.charAt(0).toUpperCase() + part.slice(1);
			})
			.join('');

		// Generate a suggested search data entry
		const suggestedSearchData = {
			iconName,
			title: originalComponentName,
			library: libraryId,
			tags: [], // Empty tags array - needs to be filled manually
		};

		return {
			iconName,
			originalComponentName,
			suggestedSearchData,
		};
	});
}

/**
 * Generates a JSON template for missing icons that can be added to search data
 *
 * @param {string} libraryId - The library ID
 * @return {string} JSON string with suggested search data entries
 */
export function generateSearchDataTemplate(libraryId: string): string {
	const missingDetails = getMissingIconsDetails(libraryId);

	if (missingDetails.length === 0) {
		return `// No missing icons found for ${libraryId} library`;
	}

	const template = missingDetails
		.map((detail) => {
			return `	{
		"iconName": "${detail.iconName}",
		"title": "${detail.originalComponentName}",
		"library": "${libraryId}",
		"tags": [
			// Add relevant tags here
		]
	}`;
		})
		.join(',\n');

	return `[\n${template}\n]`;
}

/**
 * Logs missing icons information to console
 *
 * @param {string} libraryId - The library ID (optional, if not provided logs all libraries)
 */
export function logMissingIcons(libraryId?: string): void {
	if (libraryId) {
		const missingIcons = getMissingIcons(libraryId);
		const config = libraryConfigs[libraryId];

		if (!config) {
			console.warn(
				`⚠️  No configuration found for library: ${libraryId}`
			);
			return;
		}

		console.log(`\n=== ${config.name} Library Missing Icons ===`);
		console.log(
			`Total exported icons: ${Object.keys(config.icons).length}`
		);
		console.log(`Total search data icons: ${config.searchData.length}`);
		console.log(`Missing icons: ${missingIcons.length}`);

		if (missingIcons.length > 0) {
			console.log('Missing icon names:');
			missingIcons.forEach((iconName) => {
				console.log(`  - ${iconName}`);
			});
		} else {
			console.log('✅ No missing icons found!');
		}
	} else {
		const allMissing = getAllMissingIcons();
		let totalMissing = 0;

		console.log('\n=== All Libraries Missing Icons Summary ===');

		Object.keys(allMissing).forEach((libId) => {
			const missingCount = allMissing[libId].length;
			totalMissing += missingCount;
			const config = libraryConfigs[libId];

			console.log(
				`${config?.name || libId}: ${missingCount} missing icons`
			);

			if (missingCount > 0) {
				allMissing[libId].forEach((iconName) => {
					console.log(`  - ${iconName}`);
				});
			}
		});

		console.log(
			`\nTotal missing icons across all libraries: ${totalMissing}`
		);
	}
}

// Export the library configs for external use if needed
export { libraryConfigs, searchLibraries };
