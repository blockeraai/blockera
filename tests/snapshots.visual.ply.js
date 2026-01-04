/**
 * Visual snapshot tests for sections design with Style Engine
 * Playwright e2e test
 */
const fs = require('fs');
const path = require('path');
const {
	savePage,
	createPost,
	appendBlocks,
	activateMuPlugin,
	deactivateMuPlugin,
	redirectToFrontPage,
	getIframeBody,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	prepareFrontendForScreenshot,
	setEditorViewportForScreenshot,
	setFrontendViewportForScreenshot,
} = require('@blockera/dev-playwright/js/support/commands');
const {
	setDeviceType,
} = require('@blockera/dev-playwright/js/utils/responsive');

/**
 * Load all test fixtures from tests/fixtures directory
 */
function loadFixtures() {
	const fixturesDir = path.join(__dirname, 'fixtures');
	const sections = {};

	if (!fs.existsSync(fixturesDir)) {
		return sections;
	}

	const fixtureFolders = fs
		.readdirSync(fixturesDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	for (const sectionId of fixtureFolders) {
		const sectionDir = path.join(fixturesDir, sectionId);
		const inputHtmlPath = path.join(sectionDir, 'input.html');

		// Skip if input.html doesn't exist
		if (!fs.existsSync(inputHtmlPath)) {
			continue;
		}

		// Load input.html content
		const sectionContent = fs.readFileSync(inputHtmlPath, 'utf8');

		if (!sectionContent) {
			continue;
		}

		// Try to load config.json for this section
		let config = null;
		const configPath = path.join(sectionDir, 'config.json');
		if (fs.existsSync(configPath)) {
			try {
				config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
			} catch (error) {
				// Config file exists but can't be parsed
				config = null;
			}
		}

		// Try to load setup.js for this section
		let setupFn = null;
		let frontendSetupFn = null;
		const setupPath = path.join(sectionDir, 'setup.js');
		if (fs.existsSync(setupPath)) {
			try {
				// Clear require cache to allow reloading
				delete require.cache[require.resolve(setupPath)];
				// Load setup function (now converted to CommonJS/Playwright)
				const setupModule = require(setupPath);
				setupFn = setupModule.setup || setupModule.default;
				frontendSetupFn =
					setupModule.frontendSetup || setupModule.frontendSetupFn;
			} catch (error) {
				// Setup file exists but can't be loaded
				// @debug-ignore
				console.warn(
					`Failed to load setup.js for ${sectionId}:`,
					error.message
				);
				setupFn = null;
				frontendSetupFn = null;
			}
		}

		// Check if screenshot is enabled in config
		// Default to true (test visually) if config doesn't exist
		// Only skip if config exists and screenshot is explicitly false
		const shouldScreenshot = !config || config.screenshot !== false;

		if (shouldScreenshot) {
			sections[sectionId] = { setupFn, frontendSetupFn, sectionContent };
		}
	}

	return sections;
}

const sections = loadFixtures();
const failures = [];

/**
 * Helper function to take a screenshot and compare it with expected snapshot
 * Saves screenshots to custom location: tests/fixtures/{section}/snapshot/
 * Uses Playwright's toHaveScreenshot for comparison, then moves screenshots to custom location
 *
 * @param {Object} locator - The Playwright locator for the element to screenshot.
 * @param {string} snapshotName - Name of the snapshot file.
 * @param {string} snapshotDir - Directory path where snapshots are stored.
 * @param {Object} testInfo - Playwright test info object.
 * @param {number} threshold - Screenshot comparison threshold (0-1). Default: 0.02.
 * @return {Promise<void>}
 */
async function compareScreenshot(
	locator,
	snapshotName,
	snapshotDir,
	testInfo,
	threshold = 0.02
) {
	const snapshotPath = path.join(snapshotDir, snapshotName);
	const defaultSnapshotsDir = path.join(__dirname, '__snapshots__');

	// Ensure __snapshots__ directory exists
	if (!fs.existsSync(defaultSnapshotsDir)) {
		fs.mkdirSync(defaultSnapshotsDir, { recursive: true });
	}

	// Determine which browser we're using to set the correct suffix
	// Playwright adds browser suffix (e.g., -chromium.png) to snapshot names
	const browserName = testInfo.project?.name || 'chromium'; // Default to chromium
	const browserSuffix = `-${browserName}.png`;
	const browserSnapshotName = snapshotName.replace('.png', browserSuffix);
	const browserSnapshotPath = path.join(
		defaultSnapshotsDir,
		browserSnapshotName
	);

	// Check if snapshot exists in custom location (not first run)
	const snapshotExists = fs.existsSync(snapshotPath);

	if (snapshotExists) {
		// Snapshot exists: copy from custom location to __snapshots__ for comparison
		fs.copyFileSync(snapshotPath, browserSnapshotPath);
	}

	// Use Playwright's toHaveScreenshot for comparison
	try {
		await expect(locator).toHaveScreenshot(snapshotName, {
			threshold,
		});

		// Comparison succeeded: copy from __snapshots__ to custom location and clean up
		await new Promise((resolve) => setTimeout(resolve, 100));

		if (fs.existsSync(browserSnapshotPath)) {
			// Copy to custom location (remove browser suffix)
			fs.copyFileSync(browserSnapshotPath, snapshotPath);
			fs.unlinkSync(browserSnapshotPath);
		}
	} catch (error) {
		// Comparison failed: copy actual screenshot to both locations
		await new Promise((resolve) => setTimeout(resolve, 100));

		const actualScreenshotName = snapshotName.replace(
			'.png',
			'-actual.png'
		);
		const actualScreenshotPath = testInfo.outputDir
			? path.join(testInfo.outputDir, actualScreenshotName)
			: null;

		if (actualScreenshotPath && fs.existsSync(actualScreenshotPath)) {
			// Copy the actual screenshot to custom location
			fs.copyFileSync(actualScreenshotPath, snapshotPath);

			// Also ensure it exists in __snapshots__ (keep copy there)
			if (!fs.existsSync(browserSnapshotPath)) {
				fs.copyFileSync(actualScreenshotPath, browserSnapshotPath);
			}
		}

		// Re-throw the error so the test still fails
		throw error;
	}
}

test.describe('Sections design with Style Engine', () => {
	for (const section of Object.keys(sections)) {
		const sectionData = sections[section];
		const sectionContent = sectionData.sectionContent || '';
		const setupFn = sectionData?.setupFn;
		const frontendSetupFn = sectionData?.frontendSetupFn;

		// Configure snapshot directory for this specific test
		const snapshotDir = path.resolve(
			__dirname,
			'fixtures',
			section,
			'snapshot'
		);
		if (!fs.existsSync(snapshotDir)) {
			fs.mkdirSync(snapshotDir, { recursive: true });
		}

		// Create a separate describe block for each test to configure snapshot path
		test.describe(section, () => {
			// Override snapshotPath in beforeEach to ensure it's set before test runs
			test.beforeEach(({}, testInfo) => {
				// Override snapshotPath function to use custom directory
				// This must be done before any toHaveScreenshot calls
				testInfo.snapshotPath = (snapshotName) => {
					// Return absolute path to the custom snapshot directory
					return path.resolve(snapshotDir, snapshotName);
				};
			});

			test(section, async ({ page }, testInfo) => {
				if (!sectionContent) {
					return;
				}

				// Activate mu-plugin if mu-plugin.php exists in the test fixture folder
				const muPluginPath = `tests/fixtures/${section}/mu-plugin.php`;
				const muPluginFullPath = path.join(
					__dirname,
					'..',
					muPluginPath
				);
				let muPluginActivated = false;

				if (fs.existsSync(muPluginFullPath)) {
					// File exists, activate it
					await activateMuPlugin(page, muPluginPath);
					muPluginActivated = true;
				}

				try {
					// Check if custom setup.js exists for this test
					if (setupFn) {
						// Run custom setup function (now converted to Playwright)
						// Setup functions return false if they handle setup themselves
						// or true if default setup should run
						const result = await setupFn(page, sectionContent);
						if (result === true) {
							// Run default setup
							await createPost(page);
							await appendBlocks(page, sectionContent);
						}
					} else {
						// Run default setup
						await createPost(page);
						await appendBlocks(page, sectionContent);
					}

					// wait to make sure images loaded and content is ready
					await page.waitForTimeout(1000);

					// Editor Desktop Snapshot
					const iframeBody = await getIframeBody(page);
					const editorContainer =
						iframeBody.locator('.is-root-container');

					// Set viewport and adjust iframe height for full element capture
					await setEditorViewportForScreenshot(page, 'desktop');

					try {
						await compareScreenshot(
							editorContainer,
							`test-${section}-editor-desktop.png`,
							snapshotDir,
							testInfo,
							0.02
						);
					} catch (error) {
						failures.push({
							name: `test-${section}-editor-desktop`,
							error: error.message,
						});
					}

					await setDeviceType(page, 'Mobile Portrait');

					// Set viewport and adjust iframe height for full element capture (mobile)
					await setEditorViewportForScreenshot(page, 'mobile');

					// Editor Mobile Snapshot
					try {
						await compareScreenshot(
							editorContainer,
							`test-${section}-editor-mobile.png`,
							snapshotDir,
							testInfo,
							0.02
						);
					} catch (error) {
						failures.push({
							name: `test-${section}-editor-mobile`,
							error: error.message,
						});
					}

					// Check frontend
					await savePage(page);
					await redirectToFrontPage(page);
					await prepareFrontendForScreenshot(page);

					// Run frontend setup if it exists
					if (frontendSetupFn) {
						await frontendSetupFn(page);
					}

					// wait to make sure images loaded and content is ready
					await page.waitForTimeout(500);

					await setFrontendViewportForScreenshot(page, 'desktop');

					// Frontend Desktop Snapshot
					const entryContent = page.locator('.entry-content').first();
					await entryContent.scrollIntoViewIfNeeded();

					try {
						await compareScreenshot(
							entryContent,
							`test-${section}-frontend-desktop.png`,
							snapshotDir,
							testInfo,
							0.02
						);
					} catch (error) {
						failures.push({
							name: `test-${section}-frontend-desktop`,
							error: error.message,
						});
					}

					await setFrontendViewportForScreenshot(page, 'mobile');

					// Frontend Mobile Snapshot
					await entryContent.scrollIntoViewIfNeeded();

					try {
						await compareScreenshot(
							entryContent,
							`test-${section}-frontend-mobile.png`,
							snapshotDir,
							testInfo,
							0.02
						);
					} catch (error) {
						failures.push({
							name: `test-${section}-frontend-mobile`,
							error: error.message,
						});
					}
				} finally {
					// Deactivate mu-plugin if it was activated
					if (muPluginActivated) {
						await deactivateMuPlugin(page, muPluginPath);
					}
				}
			});
		});
	}

	test.afterAll(() => {
		// After all tests, check if any failed and throw combined error
		if (failures.length > 0) {
			const errorMessage = failures
				.map((f, i) => `\n${i + 1}. ${f.name}:\n   ${f.error}`)
				.join('\n');
			throw new Error(
				`${failures.length} screenshot(s) failed:${errorMessage}`
			);
		}
	});
});
