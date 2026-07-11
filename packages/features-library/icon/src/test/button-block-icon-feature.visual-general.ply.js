/**
 * Visual snapshot test for Button Block → Icon Feature
 * Playwright e2e test
 */
const path = require('path');
const fs = require('fs');
const {
	appendBlocks,
	savePage,
	createPost,
	redirectToFrontPage,
	getIframeBody,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	prepareFrontendForScreenshot,
	setEditorViewportForScreenshot,
	setFrontendViewportForScreenshot,
	getByAriaLabel,
	getBlock,
	getParentContainer,
	setColorControlValue,
} = require('@blockera/dev-playwright/js/support/commands');
const { deSelectBlock } = require('@blockera/dev-playwright/js/utils/editor');

const failures = [];

/** WordPress block-inspector tab (Blockera no longer renders data-test settings/style tabs). */
const getInspectorTab = (page, name) =>
	page.locator(
		`.block-editor-block-inspector__tabs [role="tab"][aria-label="${name}"]`
	);

test.describe('Button Block → Icon Feature', () => {
	// Configure snapshot directory for this test
	const snapshotDir = path.resolve(__dirname, 'snapshots');
	if (!fs.existsSync(snapshotDir)) {
		fs.mkdirSync(snapshotDir, { recursive: true });
	}

	test.beforeEach(({}, testInfo) => {
		// Override snapshotPath function to use custom directory
		testInfo.snapshotPath = (snapshotName) => {
			return path.resolve(snapshotDir, snapshotName);
		};
	});

	test('should be able to add icon to button + visual test', async ({
		page,
	}, testInfo) => {
		await createPost(page);

		await appendBlocks(
			page,
			`<!-- wp:group {"blockeraPropsId":"0d0c133a-f40f-4846-bfbb-66a99db8888f","blockeraCompatId":"73117745690","blockeraSpacing":{"value":{"padding":{"top":"50px","right":"50px","bottom":"100px","left":"50px"}}},"className":"blockera-block blockera-block\u002d\u002dugv338","style":{"spacing":{"padding":{"top":"50px","right":"50px","bottom":"100px","left":"50px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group blockera-block blockera-block--ugv338" style="padding-top:50px;padding-right:50px;padding-bottom:100px;padding-left:50px"><!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 1</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 2</a></div>
<!-- /wp:button -->

<!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">button 3</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->`
		);

		//
		// 1. Check editor
		//

		//
		// 1.1. Left icon
		//
		const firstButton = await getBlock(page, 'core/button');
		await firstButton.first().click();
		await getInspectorTab(page, 'Settings').click();

		await getByAriaLabel(page, 'Choose Icon…').click();

		const popover1 = page.locator('[data-wp-component="Popover"]').last();
		await popover1.locator('[aria-label="add-card Icon"]').click();
		await page.waitForTimeout(1000);

		//
		// 1.2. Right icon
		//
		const secondButton = await getBlock(page, 'core/button');
		await secondButton.nth(1).click();
		await getInspectorTab(page, 'Settings').click();

		// set icon
		await getByAriaLabel(page, 'Choose Icon…').click();
		const popover2 = page.locator('[data-wp-component="Popover"]').last();
		await popover2.locator('[aria-label="add-submenu Icon"]').click();
		await page.waitForTimeout(1000);

		// set end icon
		await getByAriaLabel(page, 'End').click();

		// set gap
		const gapContainer = await getParentContainer(page, 'Gap');
		await gapContainer.locator('input').fill('30');

		// set size
		const sizeContainer = await getParentContainer(page, 'Size');
		await sizeContainer.locator('input').fill('30');

		// set color
		await setColorControlValue(page, 'Color', '666666');
		await page.waitForTimeout(1000);

		//
		// 1.3. Icon inner block
		//
		const thirdButton = await getBlock(page, 'core/button');
		await thirdButton.nth(2).click();
		await getInspectorTab(page, 'Settings').click();

		// set icon
		await getByAriaLabel(page, 'Choose Icon…').click();
		const popover3 = page.locator('[data-wp-component="Popover"]').last();
		await popover3.locator('[aria-label="block-meta Icon"]').click();
		await page.waitForTimeout(1000);

		// switch by advanced icon settings button from extension
		await getByAriaLabel(page, 'Advanced Icon Settings').click();

		await expect(
			page.locator(
				'.blockera-extension-block-card.block-card--inner-block'
			)
		).toBeVisible();

		await getInspectorTab(page, 'Styles').click();
		await setColorControlValue(page, 'BG Color', '0065FE');
		await page.waitForTimeout(1000);

		//
		// 1.4. Visual Test
		//
		// Deselect block to have clean screenshot.
		await deSelectBlock(page);

		// Wait for content to be ready
		await page.waitForTimeout(1000);

		// Editor Desktop Snapshot
		const iframeBody = getIframeBody(page);
		const editorContainer = iframeBody.locator('.is-root-container');

		// Set viewport and adjust iframe height for full element capture
		await setEditorViewportForScreenshot(page, 'desktop');

		// Editor Snapshot
		try {
			await expect(editorContainer).toHaveScreenshot(
				'button-block-editor.png',
				{
					threshold: 0.02,
				}
			);
		} catch (error) {
			failures.push({
				name: 'button-block-editor',
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
			await expect(entryContent).toHaveScreenshot(
				'button-block-frontend.png',
				{
					threshold: 0.02,
				}
			);
		} catch (error) {
			failures.push({
				name: 'button-block-frontend',
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
