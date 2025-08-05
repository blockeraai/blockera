import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

// Import the missing icons utility
import {
	getMissingIcons,
	getAllMissingIcons,
	getMissingIconsDetails,
	logMissingIcons,
	libraryConfigs,
} from '../.patch/icons';

// Import the libraries configuration
import searchLibraries from '../search-libraries.json';

describe('Icon Libraries → Check all icons are available and search data', () => {
	beforeEach(() => {
		createPost();
	});

	/**
	 * Generates search data entries for missing icons that can be copied and pasted
	 * @param {string} libraryId - The library ID
	 * @return {string} JSON string with search data entries
	 */
	function generateSearchDataForLibrary(libraryId: string): string {
		const missingDetails = getMissingIconsDetails(libraryId);

		if (missingDetails.length === 0) {
			return `// No missing icons found for ${libraryId} library`;
		}

		const entries = missingDetails
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

		return `[\n${entries}\n]`;
	}

	/**
	 * Generates search data entries for all missing icons across all libraries
	 * @return {Object} Object with library IDs as keys and JSON strings as values
	 */
	function generateAllSearchData(): { [string]: string } {
		const result = {};

		searchLibraries.forEach((libraryId) => {
			const missingIcons = getMissingIcons(libraryId);
			if (missingIcons.length > 0) {
				result[libraryId] = generateSearchDataForLibrary(libraryId);
			}
		});

		return result;
	}

	// Test each library
	searchLibraries.forEach((libraryId) => {
		const config = libraryConfigs[libraryId];

		if (!config) {
			cy.log(`⚠️  No configuration found for library: ${libraryId}`);
			return;
		}

		it(`Check ${config.name} icons and make sure all available icons are in search data`, () => {
			// Use the utility function to get missing icons
			const missingIcons = getMissingIcons(libraryId);
			const exportedIconNames = Object.keys(config.icons);
			const searchDataIconNames = config.searchData.map(
				(item) => item.iconName
			);

			// Find icons that are in search data but not exported (optional check)
			const extraIcons = searchDataIconNames.filter(
				(iconName) => !exportedIconNames.includes(iconName)
			);

			// Log some useful information
			cy.log(`${config.name} Library:`);
			cy.log(`  Total exported icons: ${exportedIconNames.length}`);
			cy.log(`  Total search data icons: ${searchDataIconNames.length}`);

			// Console log missing icons for debugging
			if (missingIcons.length > 0) {
				console.log(`\n=== ${config.name} Library Missing Icons ===`);
				console.log(
					`Total exported icons: ${exportedIconNames.length}`
				);
				console.log(
					`Total search data icons: ${searchDataIconNames.length}`
				);
				console.log(`Missing icons: ${missingIcons.length}`);
				console.log('Missing icon names:');
				missingIcons.forEach((iconName) => {
					console.log(`  - ${iconName}`);
				});

				// Get detailed information about missing icons
				const missingDetails = getMissingIconsDetails(libraryId);
				console.log('\nDetailed missing icons information:');
				missingDetails.forEach((detail) => {
					console.log(`  Icon: ${detail.iconName}`);
					console.log(
						`  Original Component: ${detail.originalComponentName}`
					);
					console.log(
						`  Suggested Search Data:`,
						detail.suggestedSearchData
					);
					console.log('');
				});

				// Generate and log search data template for this library
				console.log(
					`\n=== ${config.name} Library - Copy & Paste Search Data ===`
				);
				console.log(`// Add this to ${libraryId}/search-data.json:`);
				const searchDataTemplate =
					generateSearchDataForLibrary(libraryId);
				console.log(searchDataTemplate);
			} else {
				console.log(
					`\n✅ ${config.name} Library: No missing icons found!`
				);
			}

			// Assert that there are no missing icons
			if (missingIcons.length > 0) {
				cy.log(
					`❌ Found ${missingIcons.length} icons that are exported but missing from ${libraryId}/search-data.json:`
				);
				missingIcons.forEach((iconName) => {
					cy.log(`   - ${iconName}`);
				});

				// This will fail the test and show the missing icons
				expect(
					missingIcons,
					`Found ${missingIcons.length} icons in ${config.name} library that are exported but missing from search-data.json. Please add them manually.`
				).to.have.length(0);
			} else {
				cy.log(
					`✅ All exported ${config.name} icons have corresponding data in search-data.json`
				);
			}

			// Optional: Log extra icons in search data that are not exported
			if (extraIcons.length > 0) {
				cy.log(
					`⚠️  Found ${extraIcons.length} icons in ${libraryId}/search-data.json that are not exported (these might be deprecated):`
				);
				extraIcons.forEach((iconName) => {
					cy.log(`   - ${iconName}`);
				});
			}

			// Additional assertion to ensure we have icons
			expect(exportedIconNames.length).to.be.greaterThan(0);
			expect(searchDataIconNames.length).to.be.greaterThan(0);
		});
	});

	// Additional test to check overall consistency
	it('Check overall icon library consistency', () => {
		// Use the utility function to get all missing icons
		const allMissingIcons = getAllMissingIcons();
		let totalExportedIcons = 0;
		let totalSearchDataIcons = 0;
		let totalMissingIcons = 0;
		let totalExtraIcons = 0;

		searchLibraries.forEach((libraryId) => {
			const config = libraryConfigs[libraryId];

			if (!config) {
				return;
			}

			const exportedIconNames = Object.keys(config.icons);
			const searchDataIconNames = config.searchData.map(
				(item) => item.iconName
			);
			const missingIcons = allMissingIcons[libraryId] || [];
			const extraIcons = searchDataIconNames.filter(
				(iconName) => !exportedIconNames.includes(iconName)
			);

			totalExportedIcons += exportedIconNames.length;
			totalSearchDataIcons += searchDataIconNames.length;
			totalMissingIcons += missingIcons.length;
			totalExtraIcons += extraIcons.length;
		});

		// Console log overall summary
		console.log('\n=== Overall Icon Library Summary ===');
		console.log(
			`Total exported icons across all libraries: ${totalExportedIcons}`
		);
		console.log(
			`Total search data icons across all libraries: ${totalSearchDataIcons}`
		);
		console.log(`Total missing icons: ${totalMissingIcons}`);
		console.log(`Total extra icons: ${totalExtraIcons}`);

		// Log detailed missing icons information for all libraries
		if (totalMissingIcons > 0) {
			console.log('\n=== Detailed Missing Icons by Library ===');
			Object.keys(allMissingIcons).forEach((libraryId) => {
				const missingCount = allMissingIcons[libraryId].length;
				if (missingCount > 0) {
					const config = libraryConfigs[libraryId];
					console.log(
						`\n${
							config?.name || libraryId
						} Library (${missingCount} missing):`
					);
					allMissingIcons[libraryId].forEach((iconName) => {
						console.log(`  - ${iconName}`);
					});
				}
			});

			// Generate and log all search data templates
			console.log(
				'\n=== ALL MISSING ICONS - COPY & PASTE SEARCH DATA ==='
			);
			const allSearchData = generateAllSearchData();

			Object.keys(allSearchData).forEach((libraryId) => {
				const config = libraryConfigs[libraryId];
				console.log(
					`\n// ${
						config?.name || libraryId
					} Library - Add to ${libraryId}/search-data.json:`
				);
				console.log(allSearchData[libraryId]);
			});
		}

		cy.log('=== Overall Icon Library Summary ===');
		cy.log(
			`Total exported icons across all libraries: ${totalExportedIcons}`
		);
		cy.log(
			`Total search data icons across all libraries: ${totalSearchDataIcons}`
		);
		cy.log(`Total missing icons: ${totalMissingIcons}`);
		cy.log(`Total extra icons: ${totalExtraIcons}`);

		// Assert overall consistency
		expect(
			totalMissingIcons,
			'All exported icons should have corresponding search data'
		).to.equal(0);
		expect(
			totalExportedIcons,
			'Should have exported icons'
		).to.be.greaterThan(0);
		expect(
			totalSearchDataIcons,
			'Should have search data icons'
		).to.be.greaterThan(0);
	});

	// Additional test to demonstrate the utility functions
	it('Demonstrate missing icons utility functions', () => {
		// Log missing icons for all libraries using the utility
		console.log('\n=== Using Missing Icons Utility ===');
		logMissingIcons();

		// Check each library individually
		searchLibraries.forEach((libraryId) => {
			const config = libraryConfigs[libraryId];
			if (config) {
				console.log(`\n--- ${config.name} Library Details ---`);
				logMissingIcons(libraryId);
			}
		});
	});
});
