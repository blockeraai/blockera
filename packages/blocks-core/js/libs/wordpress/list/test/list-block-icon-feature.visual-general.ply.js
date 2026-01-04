/**
 * Visual snapshot test for List Block → Icon Feature
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
	getByDataTest,
	getByAriaLabel,
	getBlock,
	getParentContainer,
	getByDataId,
	setColorControlValue,
	compareScreenshot,
} = require('@blockera/dev-playwright/js/support/commands');
const { deSelectBlock } = require('@blockera/dev-playwright/js/utils/editor');

const failures = [];

test.describe('List Block → Icon Feature', () => {
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

	test('should be able to add icon to list + visual test', async ({
		page,
	}, testInfo) => {
		await createPost(page);

		await appendBlocks(
			page,
			`<!-- wp:group {"blockeraPropsId":"0d0c133a-f40f-4846-bfbb-66a99db8888f","blockeraCompatId":"73117745690","blockeraSpacing":{"value":{"padding":{"top":"50px","right":"50px","bottom":"100px","left":"50px"}}},"className":"blockera-block blockera-block\u002d\u002dugv338","style":{"spacing":{"padding":{"top":"50px","right":"50px","bottom":"100px","left":"50px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group blockera-block blockera-block--ugv338" style="padding-top:50px;padding-right:50px;padding-bottom:100px;padding-left:50px"><!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>item 1 <a href="#">link is here</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 3</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:group -->`
		);

		//
		// 1. Check editor
		//

		//
		// 1.1. List icon
		//
		const listBlock = await getBlock(page, 'core/list');
		await listBlock.first().click();
		await getByAriaLabel(page, 'Select List').click();
		await getByDataTest(page, 'settings-tab').click();

		await getByAriaLabel(page, 'Choose Icon…').click();

		const popover1 = page.locator('[data-wp-component="Popover"]').last();
		await popover1.locator('[aria-label="add-card Icon"]').click();
		await page.waitForTimeout(100);

		// set color
		await setColorControlValue(page, 'Color', '666666');

		// switch by advanced icon settings button from extension
		await getByAriaLabel(page, 'Advanced Icon Settings').click();

		const innerBlockCard = page.locator(
			'.blockera-extension-block-card.block-card--inner-block'
		);
		await expect(innerBlockCard).toBeVisible();

		// the block states should not be available
		await expect(
			innerBlockCard.locator('[data-id="normal"]')
		).not.toBeVisible();
		await expect(
			innerBlockCard.locator('[data-id="hover"]')
		).not.toBeVisible();

		//
		// 1.2. List item icon
		//
		const listItem1 = await getBlock(page, 'core/list-item');
		await listItem1.nth(1).click();
		await getByDataTest(page, 'settings-tab').click();

		// set icon
		await getByAriaLabel(page, 'Choose Icon…').click();
		const popover2 = page.locator('[data-wp-component="Popover"]').last();
		await popover2.locator('[aria-label="add-submenu Icon"]').click();
		await page.waitForTimeout(100);

		// set gap
		const gapContainer = getParentContainer(page, 'Gap');
		await gapContainer.locator('input').fill('30');

		// set size
		const sizeContainer = getParentContainer(page, 'Size');
		await sizeContainer.locator('input').fill('30');

		// set color
		await setColorControlValue(page, 'Color', 'FF6060');

		//
		// 1.3. List item icon
		//
		const listItem2 = await getBlock(page, 'core/list-item');
		await listItem2.last().click();
		await getByDataTest(page, 'settings-tab').click();

		// set icon
		await getByAriaLabel(page, 'Choose Icon…').click();
		const popover3 = page.locator('[data-wp-component="Popover"]').last();
		await popover3.locator('[aria-label="block-meta Icon"]').click();
		await page.waitForTimeout(100);

		// switch by advanced icon settings button from extension
		await getByAriaLabel(page, 'Advanced Icon Settings').click();

		const innerBlockCard2 = page.locator(
			'.blockera-extension-block-card.block-card--inner-block'
		);
		await expect(innerBlockCard2).toBeVisible();

		// the block states should not be available
		await expect(
			innerBlockCard2.locator('[data-id="normal"]')
		).not.toBeVisible();
		await expect(
			innerBlockCard2.locator('[data-id="hover"]')
		).not.toBeVisible();

		await getByDataTest(page, 'style-tab').click();

		await setColorControlValue(page, 'BG Color', '0065FE');

		//
		// 1.4. Check visual
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
			await compareScreenshot(
				editorContainer,
				'list-block-editor.png',
				snapshotDir,
				testInfo,
				0.02
			);
		} catch (error) {
			failures.push({
				name: 'list-block-editor',
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
				'list-block-frontend.png',
				snapshotDir,
				testInfo,
				0.02
			);
		} catch (error) {
			failures.push({
				name: 'list-block-frontend',
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
