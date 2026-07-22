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
 *
 * Subject model (`PERF_SUBJECT`, see run-editor-benchmarks.sh):
 * - `core` — WordPress default block editor UI baseline (plugin deactivated)
 * - `blockera` — Blockera UI only (plugin active)
 * Each scenario runs one UI path per benchmark subject; results are compared after both runs.
 */

const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { EditorPerfUtils } = require('../fixtures/editor-perf-utils');
const {
	CORE_GS_PARAGRAPH_VARIATION,
	CORE_GS_GROUP_VARIATION,
} = require('../fixtures/core-editor-perf-utils');
const { sum } = require('../utils');
const {
	closeWelcomeGuide,
} = require('@blockera/dev-playwright/js/utils/editor');

// See https://github.com/WordPress/gutenberg/issues/51383#issuecomment-1613460429
const BROWSER_IDLE_WAIT = 1000;

const TAB_ROOT_SELECTOR =
	'.blockera-tabs-bar-tabs__normal-tabs [test-id^="blockera-workspace-tab--"]';

const subject = process.env.PERF_SUBJECT || 'blockera';

test.describe('Editor', () => {
	test.use({
		perfUtils: async ({ page, editor }, use) => {
			await use(new EditorPerfUtils({ page, editor, subject }));
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

		test.afterAll(async ({}, testInfo) => {
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

			if (perfUtils.isCore) {
				await perfUtils.core.openDocumentSettingsSidebar();
			} else {
				const blockLevelBgColorContainer =
					await perfUtils.getBackgroundColorContainer();
				await expect(blockLevelBgColorContainer).toBeVisible({
					timeout: 60000,
				});
			}

			const canvas = await perfUtils.getCanvas();
			const paragraph = canvas.locator('.wp-block-paragraph').first();
			await expect(paragraph).toBeVisible({ timeout: 60000 });

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const colorSuffix = String(i).padStart(2, '0');
				const colorValue = `6666${colorSuffix}`;
				const expectedHex = `#${colorValue}`;
				const blueChannel = parseInt(colorSuffix, 16);

				await metrics.startTracing();
				if (perfUtils.isCore) {
					await perfUtils.core.setBlockBackgroundColor(colorValue);
					await perfUtils.core.expectSelectedBlockBackgroundColor(
						expectedHex
					);
				} else {
					await perfUtils.setBackgroundColor(colorValue);
					await perfUtils.expectSelectedBlockBackgroundColor(
						expectedHex
					);
				}
				await perfUtils.expectCanvasBackgroundColor(
					paragraph,
					`rgb(102, 102, ${blueChannel})`
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

		test.afterAll(async ({}, testInfo) => {
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
			if (perfUtils.isCore) {
				await perfUtils.core.insertGroupBlock();
			} else {
				await perfUtils.insertParagraph();
			}
			await perfUtils.saveDraft();
			await perfUtils.disableAutosave();

			if (perfUtils.isCore) {
				await perfUtils.core.setupBlockBackgroundImage();
			} else {
				await perfUtils.ensureSelectedBlock();
				const backgroundImageContainer =
					await perfUtils.getBackgroundImageContainer();
				await expect(backgroundImageContainer).toBeVisible({
					timeout: 60000,
				});
				await perfUtils.setupBackgroundImage();
			}

			const canvas = await perfUtils.getCanvas();
			const block = perfUtils.isCore
				? canvas.locator('.wp-block-group').first()
				: canvas.locator('.wp-block-paragraph').first();
			await expect(block).toBeVisible({ timeout: 60000 });
			if (perfUtils.isCore) {
				await perfUtils.core.expectCanvasBackgroundImage(block);
			} else {
				await perfUtils.expectCanvasBackgroundImage(block);
			}

			const sizeValues = ['contain', 'cover'];
			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const sizeValue = sizeValues[(i - 1) % sizeValues.length];

				await metrics.startTracing();
				if (perfUtils.isCore) {
					await perfUtils.core.setBackgroundImageSize(sizeValue);
					await perfUtils.core.expectSelectedBlockBackgroundImageSize(
						sizeValue
					);
				} else {
					await perfUtils.setBackgroundImageSize(sizeValue);
					await perfUtils.expectSelectedBlockBackgroundImageSize(
						sizeValue
					);
				}
				await perfUtils.expectCanvasBackgroundImageSize(
					block,
					sizeValue
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

	test.describe('editor-gs-variation-bg-color', () => {
		const results = {
			gsVariationBgColor: [],
		};

		test.afterAll(async ({}, testInfo) => {
			await testInfo.attach('results', {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});
		});

		test('Measure GS variation bg color', async ({
			admin,
			page,
			perfUtils,
			metrics,
		}) => {
			let styleSlug;

			await admin.visitSiteEditor({
				canvas: 'edit',
				showWelcomeGuide: false,
			});
			await admin.waitForSiteEditor();
			await closeWelcomeGuide(page);

			if (perfUtils.isCore) {
				styleSlug = CORE_GS_PARAGRAPH_VARIATION.slug;
				await perfUtils.core.openGlobalStylesBlock('Paragraph');
				await perfUtils.core.selectGlobalStylesVariation(
					CORE_GS_PARAGRAPH_VARIATION.label
				);
			} else {
				styleSlug = `perf-sv-${Date.now()}`;
				await perfUtils.openGlobalStylesBlockStyleVariations(
					'core/paragraph'
				);
				await perfUtils.createGlobalStylesSharedStyleVariation(
					styleSlug
				);
				await perfUtils.shareGlobalStylesStyleVariationWithOtherBlocks(
					styleSlug,
					['core/heading']
				);
				const globalStylesSharedStyleVariationBgColorContainer =
					await perfUtils.getBackgroundColorContainer();
				await expect(
					globalStylesSharedStyleVariationBgColorContainer
				).toBeVisible({
					timeout: 60000,
				});
			}

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const colorSuffix = String(i).padStart(2, '0');
				const colorValue = `4455${colorSuffix}`;
				const expectedHex = `#${colorValue}`;

				await metrics.startTracing();
				if (perfUtils.isCore) {
					await perfUtils.core.setGlobalStylesBackgroundColor(
						colorValue
					);
					await perfUtils.core.expectGlobalStylesVariationBackgroundColor(
						'core/paragraph',
						styleSlug,
						expectedHex
					);
				} else {
					await perfUtils.setBackgroundColor(colorValue);
					await perfUtils.expectGlobalStylesSharedStyleVariationBackgroundColor(
						styleSlug,
						expectedHex
					);
				}
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) &&
						'editor-gs-variation-bg-color'
				);

				const eventGroups = [
					...metrics.getClickEventDurations(),
					...metrics.getTypingEventDurations(),
				];

				if (i > throwaway) {
					results.gsVariationBgColor.push(
						eventGroups.reduce((acc, eventDurations) => {
							return acc + sum(eventDurations);
						}, 0)
					);
				}
			}
		});
	});

	test.describe('editor-gs-variation-bg-image', () => {
		const results = {
			gsVariationBgImage: [],
		};

		test.afterAll(async ({}, testInfo) => {
			await testInfo.attach('results', {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});
		});

		test('Measure GS variation bg image', async ({
			admin,
			page,
			perfUtils,
			metrics,
		}) => {
			let styleSlug = null;
			let gsBlockType = 'core/group';

			await admin.visitSiteEditor({
				canvas: 'edit',
				showWelcomeGuide: false,
			});
			await admin.waitForSiteEditor();
			await closeWelcomeGuide(page);

			if (perfUtils.isCore) {
				styleSlug = CORE_GS_GROUP_VARIATION.slug;
				await perfUtils.core.openGlobalStylesBlock('Group');
				await perfUtils.core.selectGlobalStylesVariation(
					CORE_GS_GROUP_VARIATION.label
				);
				await perfUtils.core.setupGlobalStylesBackgroundImage();
			} else {
				styleSlug = `perf-sv-img-${Date.now()}`;
				gsBlockType = 'core/paragraph';
				await perfUtils.openGlobalStylesBlockStyleVariations(
					'core/paragraph'
				);
				await perfUtils.createGlobalStylesSharedStyleVariation(
					styleSlug
				);
				await perfUtils.shareGlobalStylesStyleVariationWithOtherBlocks(
					styleSlug,
					['core/heading']
				);
				const backgroundImageContainer =
					await perfUtils.getBackgroundImageContainer();
				await expect(backgroundImageContainer).toBeVisible({
					timeout: 60000,
				});
				await perfUtils.setupGlobalStylesBackgroundImage(styleSlug);
			}

			const sizeValues = ['contain', 'cover'];
			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const sizeValue = sizeValues[(i - 1) % sizeValues.length];

				await metrics.startTracing();
				if (perfUtils.isCore) {
					await perfUtils.core.setBackgroundImageSize(sizeValue);
					await perfUtils.core.expectGlobalStylesBackgroundImageSize(
						gsBlockType,
						sizeValue,
						styleSlug
					);
				} else {
					await perfUtils.setBackgroundImageSize(sizeValue, {
						globalStyles: true,
					});
					await perfUtils.expectGlobalStylesSharedStyleVariationBackgroundImageSize(
						styleSlug,
						sizeValue
					);
				}
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) &&
						'editor-gs-variation-bg-image'
				);

				const eventGroups = [
					...metrics.getClickEventDurations(),
					...metrics.getTypingEventDurations(),
				];

				if (i > throwaway) {
					results.gsVariationBgImage.push(
						eventGroups.reduce((acc, eventDurations) => {
							return acc + sum(eventDurations);
						}, 0)
					);
				}
			}
		});
	});

	test.describe('editor-gs-variation-duplicate', () => {
		const results = {
			gsVariationDuplicate: [],
		};

		const skipForCore = subject === 'core';

		// @debug-ignore — Core has no Blockera Global Styles duplicate action
		test.skip(
			skipForCore,
			'GS variation duplicate requires Blockera (PERF_SUBJECT=blockera)'
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

		test('Measure GS variation duplicate', async ({
			admin,
			page,
			perfUtils,
			metrics,
		}) => {
			// Theme preset shared across core/paragraph + core/heading (TT5 text-display).
			// Blockera Free allows one duplicate; further Duplicate clicks open the
			// upgrade modal (see style-variations.global-styles.e2e.cy.js).
			const styleSlug = 'text-display';
			const expectedHex = '#aabbcc';

			await admin.visitSiteEditor({
				canvas: 'edit',
				showWelcomeGuide: false,
			});
			await admin.waitForSiteEditor();
			await closeWelcomeGuide(page);

			await perfUtils.openGlobalStylesBlockStyleVariations(
				'core/paragraph'
			);
			await perfUtils.selectGlobalStylesStyleVariation(styleSlug);
			await perfUtils.setBackgroundColor('aabbcc');
			await perfUtils.expectGlobalStylesSharedStyleVariationBackgroundColor(
				styleSlug,
				expectedHex
			);

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// Idle wait matches Gutenberg post-editor performance suite.
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				await perfUtils.selectGlobalStylesStyleVariation(styleSlug);

				await metrics.startTracing();
				const duplicateOutcome =
					await perfUtils.duplicateGlobalStylesSharedStyleVariation(
						styleSlug
					);
				if (duplicateOutcome === 'duplicated') {
					await perfUtils.expectGlobalStylesSharedStyleVariationDuplicated(
						styleSlug,
						expectedHex
					);
				}
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) &&
						'editor-gs-variation-duplicate'
				);

				const eventGroups = [
					...metrics.getClickEventDurations(),
					...metrics.getTypingEventDurations(),
				];

				if (i > throwaway) {
					results.gsVariationDuplicate.push(
						eventGroups.reduce((acc, eventDurations) => {
							return acc + sum(eventDurations);
						}, 0)
					);
				}
			}
		});
	});

	test.describe('editor-gs-default-bg-color', () => {
		const results = {
			gsDefaultBgColor: [],
		};

		test.afterAll(async ({}, testInfo) => {
			await testInfo.attach('results', {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});
		});

		test('Measure GS default bg color', async ({
			admin,
			page,
			perfUtils,
			metrics,
		}) => {
			await admin.visitSiteEditor({
				canvas: 'edit',
				showWelcomeGuide: false,
			});
			await admin.waitForSiteEditor();
			await closeWelcomeGuide(page);

			if (perfUtils.isCore) {
				await perfUtils.core.setupGlobalStylesDefaultParagraphStyles();
			} else {
				await perfUtils.setupGlobalStylesDefaultStyleVariation(
					'core/paragraph'
				);
				const globalStylesDefaultBgColorContainer =
					await perfUtils.getBackgroundColorContainer();
				await expect(globalStylesDefaultBgColorContainer).toBeVisible({
					timeout: 60000,
				});
			}

			const canvas = await perfUtils.getCanvas();
			const paragraph = canvas.locator('.wp-block-paragraph').first();
			await expect(paragraph).toBeVisible({ timeout: 60000 });

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const colorSuffix = String(i).padStart(2, '0');
				const colorValue = `6666${colorSuffix}`;
				const expectedHex = `#${colorValue}`;
				const blueChannel = parseInt(colorSuffix, 16);

				await metrics.startTracing();
				if (perfUtils.isCore) {
					await perfUtils.core.setGlobalStylesBackgroundColor(
						colorValue
					);
					await perfUtils.core.expectGlobalStylesBlockBackgroundColor(
						'core/paragraph',
						expectedHex
					);
				} else {
					await perfUtils.setBackgroundColor(colorValue);
					await perfUtils.expectDefaultStyleVariationBackgroundColor(
						expectedHex
					);
				}
				await perfUtils.expectCanvasBackgroundColor(
					paragraph,
					`rgb(102, 102, ${blueChannel})`
				);
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) &&
						'editor-gs-default-bg-color'
				);

				const eventGroups = [
					...metrics.getClickEventDurations(),
					...metrics.getTypingEventDurations(),
				];

				if (i > throwaway) {
					results.gsDefaultBgColor.push(
						eventGroups.reduce((acc, eventDurations) => {
							return acc + sum(eventDurations);
						}, 0)
					);
				}
			}
		});
	});

	test.describe('editor-gs-default-bg-color-variable', () => {
		const results = {
			gsDefaultBgColorVariable: [],
		};

		test.afterAll(async ({}, testInfo) => {
			await testInfo.attach('results', {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});
		});

		test('Measure GS default bg color variable', async ({
			admin,
			page,
			perfUtils,
			metrics,
		}) => {
			const corePresetLabels = {
				'accent-3': 'Accent 3',
				'accent-4': 'Accent 4',
			};
			const variableIds = ['accent-3', 'accent-4'];

			await admin.visitSiteEditor({
				canvas: 'edit',
				showWelcomeGuide: false,
			});
			await admin.waitForSiteEditor();
			await closeWelcomeGuide(page);

			if (perfUtils.isCore) {
				await perfUtils.core.setupGlobalStylesDefaultParagraphStyles();
			} else {
				await perfUtils.setupGlobalStylesDefaultStyleVariation(
					'core/paragraph'
				);
				const globalStylesDefaultBgColorContainer =
					await perfUtils.getBackgroundColorContainer();
				await expect(globalStylesDefaultBgColorContainer).toBeVisible({
					timeout: 60000,
				});
			}

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const variableId = variableIds[(i - 1) % variableIds.length];

				await metrics.startTracing();
				if (perfUtils.isCore) {
					await perfUtils.core.setGlobalStylesBackgroundPreset(
						corePresetLabels[variableId]
					);
					await perfUtils.core.expectGlobalStylesBackgroundPreset(
						'core/paragraph',
						variableId
					);
				} else {
					await perfUtils.setBackgroundColorVariable(variableId);
					await perfUtils.expectDefaultStyleVariationBackgroundColorVariable(
						variableId
					);
				}
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) &&
						'editor-gs-default-bg-color-variable'
				);

				const eventGroups = [
					...metrics.getClickEventDurations(),
					...metrics.getTypingEventDurations(),
				];

				if (i > throwaway) {
					results.gsDefaultBgColorVariable.push(
						eventGroups.reduce((acc, eventDurations) => {
							return acc + sum(eventDurations);
						}, 0)
					);
				}
			}
		});
	});
});
