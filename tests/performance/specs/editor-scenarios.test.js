/**
 * Block editor client performance scenarios (PR vs Core / PR vs Master).
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
 * - `core` — WordPress default block editor UI baseline (plugin deactivated).
 *   Only scenarios without `requiresBlockera` (e.g. select-blocks) run.
 * - `blockera` — Blockera UI (plugin active)
 *
 * Scenario scope (`PERF_SCENARIO_SCOPE`):
 * - `all` (default) — every scenario (local)
 * - `core-comparable` — scenarios without requiresBlockera (PR vs Core CI)
 * - `blockera-only` — scenarios with requiresBlockera (PR vs Master CI)
 */

const path = require('node:path');
const { test, expect } = require('@wordpress/e2e-test-utils-playwright');
const { EditorPerfUtils } = require('../fixtures/editor-perf-utils');
const {
	sum,
	iterationHexColor,
	iterationThemeColorVariable,
	iterationBorderPreset,
} = require('../utils');
const {
	closeWelcomeGuide,
} = require('@blockera/dev-playwright/js/utils/editor');

const scenariosConfig = require(
	path.join(process.cwd(), '.github/performance/editor-scenarios.json')
);
const scenarioById = new Map(
	(scenariosConfig.scenarios || []).map((scenario) => [scenario.id, scenario])
);

// See https://github.com/WordPress/gutenberg/issues/51383#issuecomment-1613460429
const BROWSER_IDLE_WAIT = 1000;

const TAB_ROOT_SELECTOR =
	'.blockera-tabs-bar-tabs__normal-tabs [test-id^="blockera-workspace-tab--"]';

const subject = process.env.PERF_SUBJECT || 'blockera';
const scenarioScope = process.env.PERF_SCENARIO_SCOPE || 'all';

/**
 * @param {string} scenarioId
 * @return {{skip: boolean, reason: string}} Skip decision for the active subject/scope.
 */
function shouldSkipScenario(scenarioId) {
	const scenario = scenarioById.get(scenarioId);
	const requiresBlockera = Boolean(scenario?.requiresBlockera);

	if (subject === 'core' && requiresBlockera) {
		return {
			skip: true,
			reason: `${scenarioId} requires Blockera (PERF_SUBJECT=blockera)`,
		};
	}

	if (scenarioScope === 'core-comparable' && requiresBlockera) {
		return {
			skip: true,
			reason: `${scenarioId} skipped (PERF_SCENARIO_SCOPE=core-comparable)`,
		};
	}

	if (scenarioScope === 'blockera-only' && !requiresBlockera) {
		return {
			skip: true,
			reason: `${scenarioId} skipped (PERF_SCENARIO_SCOPE=blockera-only)`,
		};
	}

	return { skip: false, reason: '' };
}

test.describe('Editor', () => {
	test.use({
		perfUtils: async ({ page, editor }, use) => {
			await use(new EditorPerfUtils({ page, editor }));
		},
	});

	test.describe('editor-select-blocks', () => {
		const results = {
			focus: [],
		};

		const { skip, reason } = shouldSkipScenario('editor-select-blocks');
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
				return;
			}
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

		const { skip, reason } = shouldSkipScenario('editor-workspace-tabs');
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
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

		const { skip, reason } = shouldSkipScenario('editor-block-bg-color');
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
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

			const blockLevelBgColorContainer =
				await perfUtils.getBackgroundColorContainer();
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
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const { colorValue, expectedHex, blueChannel } =
					iterationHexColor(i);

				await metrics.startTracing();
				await perfUtils.setBackgroundColor(colorValue);
				await perfUtils.expectSelectedBlockBackgroundColor(expectedHex);
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

		const { skip, reason } = shouldSkipScenario('editor-block-bg-image');
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
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

			await perfUtils.ensureSelectedBlock();
			const backgroundImageContainer =
				await perfUtils.getBackgroundImageContainer();
			await expect(backgroundImageContainer).toBeVisible({
				timeout: 60000,
			});
			await perfUtils.setupBackgroundImage();

			const canvas = await perfUtils.getCanvas();
			const block = canvas.locator('.wp-block-paragraph').first();
			await expect(block).toBeVisible({ timeout: 60000 });
			await perfUtils.expectCanvasBackgroundImage(block);

			const sizeValues = ['contain', 'cover'];
			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const sizeValue = sizeValues[(i - 1) % sizeValues.length];

				await metrics.startTracing();
				await perfUtils.setBackgroundImageSize(sizeValue);
				await perfUtils.expectSelectedBlockBackgroundImageSize(
					sizeValue
				);
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

		const { skip, reason } = shouldSkipScenario(
			'editor-gs-variation-bg-color'
		);
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
				return;
			}
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
			await admin.visitSiteEditor({
				canvas: 'edit',
				showWelcomeGuide: false,
			});
			await admin.waitForSiteEditor();
			await closeWelcomeGuide(page);

			const styleSlug = `perf-sv-${Date.now()}`;
			await perfUtils.openGlobalStylesBlockStyleVariations(
				'core/paragraph'
			);
			await perfUtils.createGlobalStylesSharedStyleVariation(styleSlug);
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

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const { colorValue, expectedHex } = iterationHexColor(
					i,
					'4455'
				);

				await metrics.startTracing();
				await perfUtils.setBackgroundColor(colorValue);
				await perfUtils.expectGlobalStylesSharedStyleVariationBackgroundColor(
					styleSlug,
					expectedHex
				);
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

		const { skip, reason } = shouldSkipScenario(
			'editor-gs-variation-bg-image'
		);
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
				return;
			}
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
			await admin.visitSiteEditor({
				canvas: 'edit',
				showWelcomeGuide: false,
			});
			await admin.waitForSiteEditor();
			await closeWelcomeGuide(page);

			const styleSlug = `perf-sv-img-${Date.now()}`;
			await perfUtils.openGlobalStylesBlockStyleVariations(
				'core/paragraph'
			);
			await perfUtils.createGlobalStylesSharedStyleVariation(styleSlug);
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

			const sizeValues = ['contain', 'cover'];
			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const sizeValue = sizeValues[(i - 1) % sizeValues.length];

				await metrics.startTracing();
				await perfUtils.setBackgroundImageSize(sizeValue, {
					globalStyles: true,
				});
				await perfUtils.expectGlobalStylesSharedStyleVariationBackgroundImageSize(
					styleSlug,
					sizeValue
				);
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

		const { skip, reason } = shouldSkipScenario(
			'editor-gs-variation-duplicate'
		);
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
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

			await admin.visitSiteEditor({
				canvas: 'edit',
				showWelcomeGuide: false,
			});
			await admin.waitForSiteEditor();
			await closeWelcomeGuide(page);

			await perfUtils.openGlobalStylesBlockStyleVariations(
				'core/paragraph'
			);

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// Idle wait matches Gutenberg post-editor performance suite.
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const { colorValue, expectedHex } = iterationHexColor(
					i,
					'aabb'
				);

				await perfUtils.selectGlobalStylesStyleVariation(styleSlug);
				await perfUtils.setBackgroundColor(colorValue);
				await perfUtils.expectGlobalStylesSharedStyleVariationBackgroundColor(
					styleSlug,
					expectedHex
				);

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

		const { skip, reason } = shouldSkipScenario(
			'editor-gs-default-bg-color'
		);
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
				return;
			}
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

			await perfUtils.setupGlobalStylesDefaultStyleVariation(
				'core/paragraph'
			);
			const globalStylesDefaultBgColorContainer =
				await perfUtils.getBackgroundColorContainer();
			await expect(globalStylesDefaultBgColorContainer).toBeVisible({
				timeout: 60000,
			});

			const canvas = await perfUtils.getCanvas();
			const paragraph = canvas.locator('.wp-block-paragraph').first();
			await expect(paragraph).toBeVisible({ timeout: 60000 });

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const { colorValue, expectedHex, blueChannel } =
					iterationHexColor(i);

				await metrics.startTracing();
				await perfUtils.setBackgroundColor(colorValue);
				await perfUtils.expectDefaultStyleVariationBackgroundColor(
					expectedHex
				);
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

		const { skip, reason } = shouldSkipScenario(
			'editor-gs-default-bg-color-variable'
		);
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
				return;
			}
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
			await admin.visitSiteEditor({
				canvas: 'edit',
				showWelcomeGuide: false,
			});
			await admin.waitForSiteEditor();
			await closeWelcomeGuide(page);

			await perfUtils.setupGlobalStylesDefaultStyleVariation(
				'core/paragraph'
			);
			const globalStylesDefaultBgColorContainer =
				await perfUtils.getBackgroundColorContainer();
			await expect(globalStylesDefaultBgColorContainer).toBeVisible({
				timeout: 60000,
			});

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const { slug: variableId } = iterationThemeColorVariable(i);

				await metrics.startTracing();
				await perfUtils.setBackgroundColorVariable(variableId);
				await perfUtils.expectDefaultStyleVariationBackgroundColorVariable(
					variableId
				);
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

	test.describe('editor-gs-seed-border-preset', () => {
		const results = {
			gsSeedBorderPreset: [],
		};

		const { skip, reason } = shouldSkipScenario(
			'editor-gs-seed-border-preset'
		);
		// @debug-ignore — conditional skip via PERF_SUBJECT / PERF_SCENARIO_SCOPE
		test.skip(skip, reason);

		test.afterAll(async ({}, testInfo) => {
			if (skip) {
				return;
			}
			await testInfo.attach('results', {
				body: JSON.stringify(results, null, 2),
				contentType: 'application/json',
			});
		});

		test('Measure GS seed border preset', async ({
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

			const samples = 10;
			const throwaway = 1;
			const iterations = samples + throwaway;

			for (let i = 1; i <= iterations; i++) {
				// eslint-disable-next-line no-restricted-syntax
				await page.waitForTimeout(BROWSER_IDLE_WAIT);

				const { presetName, widthPx } = iterationBorderPreset(i);

				await metrics.startTracing();
				await perfUtils.seedGlobalStylesBorderPreset({
					presetName,
					widthPx,
				});
				await perfUtils.expectGlobalStylesBorderPresetSeeded({
					presetName,
					widthPx,
				});
				await metrics.stopTracing(
					i === Math.floor(iterations / 2) &&
						'editor-gs-seed-border-preset'
				);

				const eventGroups = [
					...metrics.getClickEventDurations(),
					...metrics.getTypingEventDurations(),
				];

				if (i > throwaway) {
					results.gsSeedBorderPreset.push(
						eventGroups.reduce((acc, eventDurations) => {
							return acc + sum(eventDurations);
						}, 0)
					);
				}
			}
		});
	});
});
