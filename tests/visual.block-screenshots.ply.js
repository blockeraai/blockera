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
	applyDomSearchReplace,
} = require('@blockera/dev-playwright/js/support/commands');
const {
	setDeviceType,
} = require('@blockera/dev-playwright/js/utils/responsive');

/**
 * Optional CI batch list from `VISUAL_SNAPSHOT_FIXTURES` (comma-separated folder names).
 * Set by GitHub Actions matrix jobs; local runs leave this unset to exercise all fixtures.
 */
function getEnvFixtureList() {
	const raw = process.env.VISUAL_SNAPSHOT_FIXTURES;

	if (!raw || !raw.trim()) {
		return null;
	}

	return new Set(
		raw
			.split(',')
			.map((name) => name.trim())
			.filter(Boolean)
	);
}

/**
 * Optional PR allowlist from `.pr-playwright.env.json` → `visualSnapshotFixtures`.
 * Missing key or empty array → run all fixtures (unless CI env list is set).
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
		// @debug-ignore
		console.warn(
			'Failed to read visualSnapshotFixtures from .pr-playwright.env.json:',
			error.message
		);
		return null;
	}
}

/**
 * Resolve which fixture folders are allowed for this run.
 * CI env list wins (already batched + allowlist-filtered); otherwise PR allowlist; else all.
 */
function getFixtureFilter() {
	return getEnvFixtureList() || getVisualSnapshotFixtureAllowlist();
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

	const allowlist = getFixtureFilter();
	const fixtureFolders = fs
		.readdirSync(fixturesDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)
		.sort();

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
			sections[sectionId] = {
				setupFn,
				frontendSetupFn,
				sectionContent,
				config,
			};
		}
	}

	return sections;
}

const sections = loadFixtures();

/**
 * Screenshot options shared by all visual assertions in this file.
 *
 * Use expect.soft (not try/catch + afterAll): catching toHaveScreenshot marks the
 * test as passed, and deferring failure to afterAll is attributed to the last test.
 * On CI retries that last test alone gets a fresh empty failures array, so real
 * mismatches become "flaky" and exit 0 (failOnFlakyTests: false). Soft assertions
 * keep every screenshot failure on the fixture that produced it.
 */
const screenshotOptions = {
	threshold: 0.02,
};

test.describe('Sections Visual Snapshots', () => {
	for (const section of Object.keys(sections)) {
		const sectionData = sections[section];
		const sectionContent = sectionData.sectionContent || '';
		const setupFn = sectionData?.setupFn;
		const frontendSetupFn = sectionData?.frontendSetupFn;
		const config = sectionData?.config;

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

				const editorSearchReplace =
					config?.['editor-search-replace'] || null;
				const frontendSearchReplace =
					config?.['frontend-search-replace'] || null;

				// Set viewport and adjust iframe height for full element capture
				await setEditorViewportForScreenshot(page, 'desktop');

				await applyDomSearchReplace(
					editorContainer,
					editorSearchReplace
				);

				await expect
					.soft(editorContainer)
					.toHaveScreenshot(
						`test-${section}-editor-desktop.png`,
						screenshotOptions
					);

				await setDeviceType(page, 'Mobile Portrait');

				// Set viewport and adjust iframe height for full element capture (mobile)
				await setEditorViewportForScreenshot(page, 'mobile');

				await applyDomSearchReplace(
					editorContainer,
					editorSearchReplace
				);

				// Editor Mobile Snapshot
				await expect
					.soft(editorContainer)
					.toHaveScreenshot(
						`test-${section}-editor-mobile.png`,
						screenshotOptions
					);

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

				await applyDomSearchReplace(
					entryContent,
					frontendSearchReplace
				);

				await expect
					.soft(entryContent)
					.toHaveScreenshot(
						`test-${section}-frontend-desktop.png`,
						screenshotOptions
					);

				await setFrontendViewportForScreenshot(page, 'mobile');

				// Frontend Mobile Snapshot
				await entryContent.scrollIntoViewIfNeeded();

				await applyDomSearchReplace(
					entryContent,
					frontendSearchReplace
				);

				await expect
					.soft(entryContent)
					.toHaveScreenshot(
						`test-${section}-frontend-mobile.png`,
						screenshotOptions
					);
			} finally {
				// Deactivate mu-plugin if it was activated
				if (muPluginActivated) {
					await deactivateMuPlugin(page, muPluginPath);
				}
			}
		});
	}
});
