/**
 * Block editor client performance scenarios (Blockera vs Core).
 *
 * Patterns adapted from Gutenberg test/performance/specs/post-editor.spec.js
 * (Chromium tracing via Metrics). Scenarios are listed in
 * .github/performance/editor-scenarios.json.
 *
 * Setup + measurement run in a single test so Playwright's per-test browser
 * context isolation does not drop localStorage (workspace tabs) or leave the
 * editor unloaded between steps.
 *
 * CI isolation: only `npm run test:performance:editor` (playwright.editor.config.js)
 * runs this file. Root Playwright e2e (*.ply.js), Cypress (*.e2e.cy.js), and Jest
 * (*.spec.js) explicitly ignore `tests/performance/**`.
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { EditorPerfUtils } = require('../fixtures/editor-perf-utils');
const { sum } = require('../utils');
const {
	getParentContainer,
	setColorControlValue,
} = require('@blockera/dev-playwright/js/support/commands');

// See https://github.com/WordPress/gutenberg/issues/51383#issuecomment-1613460429
const BROWSER_IDLE_WAIT = 1000;

const TAB_ROOT_SELECTOR =
	'.blockera-tabs-bar-tabs__normal-tabs [test-id^="blockera-workspace-tab--"]';

const subject = process.env.PERF_SUBJECT || 'blockera';

test.describe('Editor', () => {
	test.use({
		perfUtils: async ({ page }, use) => {
			await use(new EditorPerfUtils({ page }));
		},
	});

	test.describe('editor-select-blocks', () => {
		const results = {
			focus: [],
		};

		test.afterAll(async ({}, testInfo) => {
			await testInfo.attach('results', {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});
		});

		test('Measure select blocks', async ({
			admin,
			page,
			requestUtils,
			perfUtils,
			metrics,
		}) => {
			await requestUtils.setPreferences('core/edit-post', {
				welcomeGuide: false,
				fullscreenMode: false,
				editorMode: 'visual',
			});

			await admin.createNewPost({ showWelcomeGuide: false });
			await perfUtils.waitForEditor();
			await perfUtils.load1000Paragraphs();
			await perfUtils.saveDraft();
			await perfUtils.disableAutosave();

			const canvas = await perfUtils.getCanvas();
			let paragraphs = perfUtils.paragraphs(canvas);
			const count = await paragraphs.count();
			if (count < 12) {
				paragraphs = canvas.locator(
					'.wp-block-paragraph, p[data-type="core/paragraph"]'
				);
			}
			await expect(paragraphs.nth(11)).toBeVisible({ timeout: 60000 });

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;
			for (let i = 1; i <= iterations; i++) {
				// Idle wait matches Gutenberg post-editor performance suite.
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				await metrics.startTracing();
				await paragraphs.nth(i).click();
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) &&
						'editor-select-blocks-focus'
				);

				const allDurations = metrics.getSelectionEventDurations();

				if (i > throwaway) {
					results.focus.push(
						allDurations.reduce((acc, eventDurations) => {
							return acc + sum(eventDurations);
						}, 0)
					);
				}
			}
		});
	});

	test.describe('editor-workspace-tabs', () => {
		const results = {
			switchTab: [],
		};

		const skipForCore = subject === 'core';

		// @debug-ignore — Core has no Blockera workspace tabs
		test.skip(
			skipForCore,
			'Workspace tabs require Blockera (PERF_SUBJECT=blockera)'
		);

		test.afterAll(async ({}, testInfo) => {
			if (skipForCore) {
				return;
			}
			await testInfo.attach('results', {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});
		});

		test('Measure workspace tabs', async ({
			admin,
			page,
			requestUtils,
			perfUtils,
			metrics,
		}) => {
			await requestUtils.setPreferences('core/edit-post', {
				welcomeGuide: false,
				fullscreenMode: false,
			});

			await admin.createNewPost({ title: 'Perf Tab A' });
			await page.waitForSelector('.blockera-tabs-bar', {
				timeout: 60000,
			});
			await perfUtils.saveDraft();

			await perfUtils.resetWorkspaceTabsStorage();
			await page.reload();
			await page.waitForSelector('.blockera-tabs-bar', {
				timeout: 60000,
			});
			await expect(page.locator(TAB_ROOT_SELECTOR)).toHaveCount(1, {
				timeout: 60000,
			});

			await perfUtils.addWorkspaceTabNewPost();
			await expect(page.locator(TAB_ROOT_SELECTOR)).toHaveCount(2, {
				timeout: 60000,
			});
			await perfUtils.disableAutosave();

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// Idle wait matches Gutenberg post-editor performance suite.
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const inactive = page
					.locator(`${TAB_ROOT_SELECTOR}:not([aria-selected="true"])`)
					.first();
				const testId = await inactive.getAttribute('test-id');
				const button = inactive
					.locator('.blockera-tabs-tab-button')
					.first();

				await metrics.startTracing();
				await button.click();
				await expect(
					page.locator(`[test-id="${testId}"]`)
				).toHaveAttribute('aria-selected', 'true', {
					timeout: 30000,
				});
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) && 'editor-workspace-tabs'
				);

				const [mouseClickEvents] = metrics.getClickEventDurations();

				if (i > throwaway) {
					results.switchTab.push(mouseClickEvents[0]);
				}
			}
		});
	});

	test.describe('editor-block-bg-color', () => {
		const results = {
			blockBgColor: [],
		};

		const skipForCore = subject === 'core';

		// @debug-ignore — Core has no Blockera block-level BG Color control
		test.skip(
			skipForCore,
			'Block bg color requires Blockera (PERF_SUBJECT=blockera)'
		);

		test.afterAll(async ({}, testInfo) => {
			if (skipForCore) {
				return;
			}
			await testInfo.attach('results', {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});
		});

		test('Measure block bg color', async ({
			admin,
			page,
			requestUtils,
			perfUtils,
			metrics,
		}) => {
			await requestUtils.setPreferences('core/edit-post', {
				welcomeGuide: false,
				fullscreenMode: false,
				editorMode: 'visual',
			});

			await admin.createNewPost({ showWelcomeGuide: false });
			await perfUtils.waitForEditor();
			await perfUtils.insertParagraph();
			await perfUtils.saveDraft();
			await perfUtils.disableAutosave();

			const blockLevelBgColorContainer = await getParentContainer(
				page,
				'BG Color'
			);
			await expect(blockLevelBgColorContainer).toBeVisible({
				timeout: 60000,
			});

			const canvas = await perfUtils.getCanvas();
			const paragraph = canvas.locator('.wp-block-paragraph').first();
			await expect(paragraph).toBeVisible({ timeout: 60000 });

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// Idle wait matches Gutenberg post-editor performance suite.
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const colorSuffix = String(i).padStart(2, '0');
				const colorValue = `6666${colorSuffix}`;
				const blueChannel = parseInt(colorSuffix, 16);

				await metrics.startTracing();
				await setColorControlValue(page, 'BG Color', colorValue);
				await expect(paragraph).toHaveCSS(
					'backgroundColor',
					`rgb(102, 102, ${blueChannel})`,
					{ timeout: 30000 }
				);
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) && 'editor-block-bg-color'
				);

				const eventGroups = [
					...metrics.getClickEventDurations(),
					...metrics.getTypingEventDurations(),
				];

				if (i > throwaway) {
					results.blockBgColor.push(
						eventGroups.reduce((acc, eventDurations) => {
							return acc + sum(eventDurations);
						}, 0)
					);
				}
			}
		});
	});

	test.describe('editor-block-bg-image', () => {
		const results = {
			blockBgImage: [],
		};

		const skipForCore = subject === 'core';

		// @debug-ignore — Core has no Blockera block-level Image & Gradient control
		test.skip(
			skipForCore,
			'Block bg image requires Blockera (PERF_SUBJECT=blockera)'
		);

		test.afterAll(async ({}, testInfo) => {
			if (skipForCore) {
				return;
			}
			await testInfo.attach('results', {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});
		});

		test('Measure block bg image', async ({
			admin,
			page,
			requestUtils,
			perfUtils,
			metrics,
		}) => {
			await requestUtils.setPreferences('core/edit-post', {
				welcomeGuide: false,
				fullscreenMode: false,
				editorMode: 'visual',
			});

			await admin.createNewPost({ showWelcomeGuide: false });
			await perfUtils.waitForEditor();
			await perfUtils.insertParagraph();
			await perfUtils.saveDraft();
			await perfUtils.disableAutosave();

			const blockLevelImageAndGradientContainer =
				await getParentContainer(page, 'Image & Gradient');
			await expect(blockLevelImageAndGradientContainer).toBeVisible({
				timeout: 60000,
			});

			await perfUtils.setupBlockLevelBackgroundImage();

			const canvas = await perfUtils.getCanvas();
			const paragraph = canvas.locator('.wp-block-paragraph').first();
			await expect(paragraph).toBeVisible({ timeout: 60000 });

			const sizeValues = ['contain', 'cover'];
			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// Idle wait matches Gutenberg post-editor performance suite.
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const sizeValue = sizeValues[(i - 1) % sizeValues.length];

				await metrics.startTracing();
				await perfUtils.setBlockLevelBackgroundImageSize(sizeValue);
				await expect(paragraph).toHaveCSS(
					'background-size',
					sizeValue,
					{ timeout: 30000 }
				);
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) && 'editor-block-bg-image'
				);

				const eventGroups = [
					...metrics.getClickEventDurations(),
					...metrics.getTypingEventDurations(),
				];

				if (i > throwaway) {
					results.blockBgImage.push(
						eventGroups.reduce((acc, eventDurations) => {
							return acc + sum(eventDurations);
						}, 0)
					);
				}
			}
		});
	});
});
