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
const { expect } = require('@playwright/test');
const {
	test,
	prepareFrontendForScreenshot,
	setEditorViewportForScreenshot,
	setFrontendViewportForScreenshot,
} = require('@blockera/dev-playwright/js/support/commands');
const {
	setDeviceType,
} = require('@blockera/dev-playwright/js/utils/responsive');

/**
 * Optional PR allowlist from `.pr-playwright.env.json` → `visualSnapshotFixtures`.
 * Missing key or empty array → run all fixtures.
 */
function getVisualSnapshotFixtureAllowlist() {
	const prEnvPath = path.join(__dirname, '..', '.pr-playwright.env.json');

	if (!fs.existsSync(prEnvPath)) {
		return null;
	}

	try {
		const prEnv = JSON.parse(fs.readFileSync(prEnvPath, 'utf8'));
		const allowlist = prEnv.visualSnapshotFixtures;

		if (!Array.isArray(allowlist) || allowlist.length === 0) {
			return null;
		}

		return new Set(allowlist);
	} catch (error) {
		console.warn(
			'Failed to read visualSnapshotFixtures from .pr-playwright.env.json:',
			error.message
		);
		return null;
	}
}

/**
 * Load all test fixtures from tests/fixtures directory
 */
function loadFixtures() {
	const fixturesDir = path.join(__dirname, 'fixtures');
	const sections = {};

	if (!fs.existsSync(fixturesDir)) {
		return sections;
	}

	const allowlist = getVisualSnapshotFixtureAllowlist();
	const fixtureFolders = fs
		.readdirSync(fixturesDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	for (const sectionId of fixtureFolders) {
		if (allowlist && !allowlist.has(sectionId)) {
			continue;
		}
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

test.describe('Sections Visual Snapshots', () => {
	for (const section of Object.keys(sections)) {
		const sectionData = sections[section];
		const sectionContent = sectionData.sectionContent || '';
		const setupFn = sectionData?.setupFn;
		const frontendSetupFn = sectionData?.frontendSetupFn;

		test(`Snapshot: ${section}`, async ({ page }) => {
			if (!sectionContent) {
				return;
			}

			// Activate mu-plugin if mu-plugin.php exists in the test fixture folder
			const muPluginPath = `tests/fixtures/${section}/mu-plugin.php`;
			const muPluginFullPath = path.join(__dirname, '..', muPluginPath);
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
				await page.waitForTimeout(4000);

				// Editor Desktop Snapshot
				const iframeBody = await getIframeBody(page);
				const editorContainer =
					iframeBody.locator('.is-root-container');

				// Set viewport and adjust iframe height for full element capture
				await setEditorViewportForScreenshot(page, 'desktop');

				try {
					await expect(editorContainer).toHaveScreenshot(
						`test-${section}-editor-desktop.png`,
						{
							threshold: 0.02,
						}
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
					await expect(editorContainer).toHaveScreenshot(
						`test-${section}-editor-mobile.png`,
						{
							threshold: 0.02,
						}
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
					await expect(entryContent).toHaveScreenshot(
						`test-${section}-frontend-desktop.png`,
						{
							threshold: 0.02,
						}
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
					await expect(entryContent).toHaveScreenshot(
						`test-${section}-frontend-mobile.png`,
						{
							threshold: 0.02,
						}
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
