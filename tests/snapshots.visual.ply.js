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
	setScreenshotViewport,
	prepareEditorForScreenshot,
	prepareFrontendForScreenshot,
	wpCli,
} = require('@blockera/dev-playwright/js/support/commands');
const { editPost } = require('@blockera/dev-playwright/js/utils/site-navigation');

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
		const setupPath = path.join(sectionDir, 'setup.js');
		if (fs.existsSync(setupPath)) {
			try {
				// Clear require cache to allow reloading
				delete require.cache[require.resolve(setupPath)];
				// Load setup function (now converted to CommonJS/Playwright)
				const setupModule = require(setupPath);
				setupFn = setupModule.setup || setupModule.default;
			} catch (error) {
				// Setup file exists but can't be loaded
				console.warn(`Failed to load setup.js for ${sectionId}:`, error.message);
				setupFn = null;
			}
		}

		// Check if screenshot is enabled in config
		// Default to true (test visually) if config doesn't exist
		// Only skip if config exists and screenshot is explicitly false
		const shouldScreenshot = !config || config.screenshot !== false;

		if (shouldScreenshot) {
			sections[sectionId] = { setupFn, sectionContent };
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
	const browserSnapshotPath = path.join(defaultSnapshotsDir, browserSnapshotName);
	
	// Always ensure a snapshot file exists in __snapshots__ before calling toHaveScreenshot
	// This prevents Playwright from logging "snapshot doesn't exist" errors
	if (fs.existsSync(snapshotPath)) {
		// Copy the expected snapshot from custom location to __snapshots__ for comparison
		fs.copyFileSync(snapshotPath, browserSnapshotPath);
	} else if (!fs.existsSync(browserSnapshotPath)) {
		// On first run, take a screenshot and save it to __snapshots__ first
		// This prevents the "snapshot doesn't exist" error message
		// We'll take the screenshot now so Playwright can compare/update it
		const tempScreenshot = await locator.screenshot();
		fs.writeFileSync(browserSnapshotPath, tempScreenshot);
	}
	
	// Use Playwright's toHaveScreenshot for comparison
	// It will compare/update the snapshot in __snapshots__
	// Since we've ensured the file exists, Playwright won't log the "doesn't exist" error
	await expect(locator).toHaveScreenshot(snapshotName, {
		threshold,
	});
	
	// After Playwright saves/updates the screenshot, move it to our custom location
	// Wait a bit to ensure file is written
	await new Promise((resolve) => setTimeout(resolve, 100));
	
	// Check if Playwright created/updated the snapshot in __snapshots__
	if (fs.existsSync(browserSnapshotPath)) {
		// Move to custom location (remove browser suffix)
		fs.copyFileSync(browserSnapshotPath, snapshotPath);
		fs.unlinkSync(browserSnapshotPath);
	} else {
		// Fallback: check other possible browser names
		const possibleNames = [
			snapshotName.replace('.png', '-chromium.png'),
			snapshotName.replace('.png', '-firefox.png'),
			snapshotName.replace('.png', '-webkit.png'),
			snapshotName, // Fallback without suffix
		];
		
		let moved = false;
		for (const name of possibleNames) {
			const defaultPath = path.join(defaultSnapshotsDir, name);
			if (fs.existsSync(defaultPath)) {
				// Move to custom location (remove browser suffix)
				fs.copyFileSync(defaultPath, snapshotPath);
				fs.unlinkSync(defaultPath);
				moved = true;
				break;
			}
		}
		
		// If still no file found, take screenshot manually and save to custom location
		if (!moved) {
			const screenshotBuffer = await locator.screenshot();
			fs.writeFileSync(snapshotPath, screenshotBuffer);
		}
	}
}

test.describe('Sections design with Style Engine', () => {
	for (const section of Object.keys(sections)) {
		const sectionData = sections[section];
		const sectionContent = sectionData.sectionContent || '';
		const setupFn = sectionData?.setupFn;

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
							await setScreenshotViewport(page, 'desktop');
							await createPost(page);
							await appendBlocks(page, sectionContent);
						}
					} else {
						// Run default setup
						await setScreenshotViewport(page, 'desktop');
						await createPost(page);
						await appendBlocks(page, sectionContent);
					}

					await prepareEditorForScreenshot(page);

					// wait to make sure images loaded and content is ready
					await page.waitForTimeout(1000);

					// Editor Desktop Snapshot
					const iframeBody = await getIframeBody(page);
					const editorContainer =
						iframeBody.locator('.is-root-container');
					await editorContainer.scrollIntoViewIfNeeded();

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

					await setScreenshotViewport(page, 'mobile');

					// Editor Mobile Snapshot
					await editorContainer.scrollIntoViewIfNeeded();

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

					await prepareEditorForScreenshot(page, true);

					// Check frontend
					await savePage(page);
					await redirectToFrontPage(page);
					await prepareFrontendForScreenshot(page);

					// wait to make sure images loaded and content is ready
					await page.waitForTimeout(500);

					await setScreenshotViewport(page, 'desktop');

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

					await setScreenshotViewport(page, 'mobile');

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
