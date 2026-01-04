/**
 * Visual snapshot test for Icon Block → Functionality
 * Playwright e2e test
 */
const path = require('path');
const fs = require('fs');
const {
	savePage,
	createPost,
	redirectToFrontPage,
	getIframeBody,
	addBlockToPost,
	setBoxSpacingSide,
	setInnerBlock,
	setParentBlock,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	prepareFrontendForScreenshot,
	setEditorViewportForScreenshot,
	setFrontendViewportForScreenshot,
	getByDataTest,
	getByAriaLabel,
	getBlock,
	getParentContainer,
	setColorControlValue,
	compareScreenshot,
	checkBlockCardItems,
} = require('@blockera/dev-playwright/js/support/commands');
const { deSelectBlock } = require('@blockera/dev-playwright/js/utils/editor');

const failures = [];

test.describe('Icon Block → Functionality + Visual Test', () => {
	// Configure snapshot directory for this test
	const snapshotDir = path.resolve(__dirname, 'snapshots');
	if (!fs.existsSync(snapshotDir)) {
		fs.mkdirSync(snapshotDir, { recursive: true });
	}

	test.beforeEach(async ({ page }, testInfo) => {
		// Set viewport
		await page.setViewportSize({ width: 1280, height: 1200 });

		// Override snapshotPath function to use custom directory
		testInfo.snapshotPath = (snapshotName) => {
			return path.resolve(snapshotDir, snapshotName);
		};
	});

	test('Icon block functionality + visual test', async ({
		page,
	}, testInfo) => {
		await createPost(page);

		/**
		 * 0. Add wrapper group block
		 */
		await addBlockToPost(page, 'core/group/group');

		const groupBlock = await getBlock(page, 'core/group');
		await groupBlock.last().click();

		let iframeBody = getIframeBody(page);
		await iframeBody
			.locator('[aria-label="Group: Gather blocks in a container."]')
			.click();

		await setBoxSpacingSide(page, 'padding-top', 50);
		await setBoxSpacingSide(page, 'padding-right', 50);
		await setBoxSpacingSide(page, 'padding-left', 50);
		await setBoxSpacingSide(page, 'padding-bottom', 100);

		/**
		 * 1. Simple and clean icon
		 */
		await addBlockToPost(page, 'core/image/blockera/icon', {
			blockInserterSelector: '.block-editor-button-block-appender',
		});

		// select image block
		const imageBlock1 = await getBlock(page, 'core/image');
		await imageBlock1.last().click();

		/**
		 * 2. Select icon and change color
		 */

		// Switch to parent block
		await getByAriaLabel(page, 'Select Group').click();

		await addBlockToPost(page, 'core/image/blockera/icon', {
			blockInserterSelector: '.block-editor-inserter__toggle',
		});

		const imageBlock2 = await getBlock(page, 'core/image');
		await imageBlock2.last().click();

		await getByDataTest(page, 'settings-tab').click();

		await getByAriaLabel(page, 'Icon Library').click({ force: true });

		const popover1 = page.locator('[data-wp-component="Popover"]').last();
		await popover1.locator('[aria-label="add-card Icon"]').click();
		await page.waitForTimeout(1000);

		await setColorControlValue(page, 'Color', '0C3EF1');
		await page.waitForTimeout(1000);

		/**
		 * 3. Select icon and use rotation button
		 */
		// Switch to parent block
		await getByAriaLabel(page, 'Select Group').click();

		await addBlockToPost(page, 'core/image/blockera/icon', {
			blockInserterSelector: '.block-editor-inserter__toggle',
		});

		const imageBlock3 = await getBlock(page, 'core/image');
		await imageBlock3.last().click();

		await getByDataTest(page, 'settings-tab').click();

		await getByAriaLabel(page, 'Icon Library').click({ force: true });

		const popover2 = page.locator('[data-wp-component="Popover"]').last();
		await popover2.locator('[aria-label="at-symbol Icon"]').click();
		await page.waitForTimeout(1000);

		await setColorControlValue(page, 'Color', 'C22A2A');

		await getByAriaLabel(page, 'Rotate').click({ force: true });
		await getByAriaLabel(page, 'Flip Horizontal').click({ force: true });
		await getByAriaLabel(page, 'Flip Vertical').click({ force: true });
		await page.waitForTimeout(1000);

		await getByDataTest(page, 'style-tab').click();

		const widthContainer = getParentContainer(page, 'Width');
		await widthContainer.locator('input').clear({ force: true });
		await widthContainer.locator('input').fill('150');
		await page.waitForTimeout(1000);

		/**
		 * 3. customize img/svg inner block
		 */
		// Switch to parent block
		await getByAriaLabel(page, 'Select Group').click();

		await addBlockToPost(page, 'core/image/blockera/icon', {
			blockInserterSelector: '.block-editor-inserter__toggle',
		});

		const imageBlock4 = await getBlock(page, 'core/image');
		await imageBlock4.last().click();

		await getByDataTest(page, 'settings-tab').click();

		await getByAriaLabel(page, 'Icon Library').click({ force: true });

		const popover3 = page.locator('[data-wp-component="Popover"]').last();
		await popover3.locator('[aria-label="audio Icon"]').click();
		await page.waitForTimeout(1000);

		await getByDataTest(page, 'style-tab').click();

		await setColorControlValue(page, 'BG Color', 'eeeeee');

		await setBoxSpacingSide(page, 'padding-top', 50);
		await setBoxSpacingSide(page, 'padding-right', 50);
		await setBoxSpacingSide(page, 'padding-left', 50);
		await setBoxSpacingSide(page, 'padding-bottom', 50);

		const radiusContainer = getParentContainer(page, 'Radius');
		await radiusContainer
			.locator('input[type="text"]')
			.clear({ force: true });
		await radiusContainer.locator('input[type="text"]').fill('25');
		await page.waitForTimeout(1000);

		//
		// 3.1. img/svg tag inner block
		//
		await setInnerBlock(page, 'elements/img-tag');

		await checkBlockCardItems(page, ['normal', 'hover'], true);

		//
		// 3.1.1. BG color
		//
		await setColorControlValue(page, 'BG Color', '59ff00');
		await page.waitForTimeout(1000);

		//
		// 4. Check settings tab
		//
		await setParentBlock(page);
		await getByDataTest(page, 'settings-tab').click();

		const inspector = page.locator('.block-editor-block-inspector');
		const settingsHeader = inspector
			.locator('.components-tools-panel-header')
			.filter({ hasText: 'Settings' });
		await settingsHeader.scrollIntoViewIfNeeded();
		await expect(settingsHeader).toBeVisible();

		const toolsPanel = inspector.locator(
			'.components-tools-panel:not(.block-editor-bindings__panel)'
		);

		const aspectRatioLabel = toolsPanel
			.locator('.components-input-control__label')
			.filter({ hasText: 'Aspect ratio' });
		await expect(aspectRatioLabel).toHaveCount(1);
		await expect(aspectRatioLabel).not.toBeVisible();

		const widthLabel = toolsPanel
			.locator('.components-input-control__label')
			.filter({ hasText: 'Width' });
		await expect(widthLabel).toHaveCount(1);
		await expect(widthLabel).not.toBeVisible();

		const heightLabel = toolsPanel
			.locator('.components-input-control__label')
			.filter({ hasText: 'Height' });
		await expect(heightLabel).toHaveCount(1);
		await expect(heightLabel).not.toBeVisible();

		/**
		 * 5. Visual test in editor
		 */
		// Deselect block to have clean screenshot.
		await deSelectBlock(page);

		// Wait for content to be ready
		await page.waitForTimeout(1000);

		// Editor Desktop Snapshot
		iframeBody = getIframeBody(page);
		const editorContainer = iframeBody.locator('.is-root-container');

		// Set viewport and adjust iframe height for full element capture
		await setEditorViewportForScreenshot(page, 'desktop');

		// Editor Snapshot
		try {
			await compareScreenshot(
				editorContainer,
				'icon-block-editor.png',
				snapshotDir,
				testInfo,
				0.02
			);
		} catch (error) {
			failures.push({
				name: 'icon-block-editor',
				error: error.message,
			});
		}

		// Check frontend
		await savePage(page);
		await redirectToFrontPage(page);
		await prepareFrontendForScreenshot(page);

		// Wait for content to be ready
		await page.waitForTimeout(500);

		// Frontend Desktop Snapshot
		const entryContent = page.locator('.entry-content').first();
		await entryContent.scrollIntoViewIfNeeded();

		await setFrontendViewportForScreenshot(page, 'desktop');

		// Frontend Snapshot
		try {
			await compareScreenshot(
				entryContent,
				'icon-block-frontend.png',
				snapshotDir,
				testInfo,
				0.02
			);
		} catch (error) {
			failures.push({
				name: 'icon-block-frontend',
				error: error.message,
			});
		}
	});

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
