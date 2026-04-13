/**
 * Group Block → Link Inner Block → WP Data Compatibility
 * Playwright e2e test
 */
const {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	setColorControlValue,
	clearColorControlValue,
	openGlobalStylesPanel,
	addNewTransition,
} = require('@blockera/dev-playwright/js/support/commands');
const {
	setInnerBlock,
} = require('@blockera/dev-playwright/js/utils/inner-blocks');

test.describe('Group Block → Post Date Inner Block → WP Data Compatibility', () => {
	test.beforeEach(async ({ page, admin }) => {
		await openSiteEditor(page, admin);

		await openGlobalStylesPanel(page);

		await closeWelcomeGuide(page);

		await getByDataTest(page, 'block-style-variations').nth(1).click();

		await page.locator('button[id="/blocks/core%2Fgroup"]').click();
	});

	test.describe('Provide color for the global style of `core/post-date` inner block of `core/group` block type scenario', () => {
		test('(from and to) WordPress compatible functionality testing', async ({
			page,
		}) => {
			await getByDataTest(page, 'style-section-1').click();

			// Simulate user first interaction to run compatibility cross current global style for block.
			await addNewTransition(page);

			await setInnerBlock(page, 'core/post-date');

			//
			// Test 1: WP data to Blockera
			//

			const globalStylesRecord = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root =
				globalStylesRecord?.['core/group']?.variations['section-1'];
			const postDateInnerBlock = root?.blocks?.['core/post-date'];

			// WP data should come to Blockera
			const blockeraInnerBlocks = root?.blockeraInnerBlocks?.value;
			const blockeraPostDateInnerBlock =
				blockeraInnerBlocks?.['core/post-date']?.attributes;

			expect('color-mix(in srgb, currentColor 85%, transparent)').toEqual(
				postDateInnerBlock?.color?.text
			);
			expect('color-mix(in srgb, currentColor 85%, transparent)').toEqual(
				blockeraPostDateInnerBlock?.blockeraFontColor
			);

			//
			// Test 2: Blockera value to WP data
			//

			//
			// Normal → Text Color
			//
			await setColorControlValue(page, 'Text Color', '#666666');

			const globalStylesRecord2 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root2 =
				globalStylesRecord2?.['core/group']?.variations['section-1'];
			const postDateInnerBlock2 = root2?.blocks?.['core/post-date'];
			const blockeraInnerBlocks2 = root2?.blockeraInnerBlocks?.value;
			const blockeraPostDateInnerBlock2 =
				blockeraInnerBlocks2?.['core/post-date']?.attributes;

			expect('#666666').toEqual(postDateInnerBlock2?.color?.text);
			expect('#666666').toEqual(
				blockeraPostDateInnerBlock2?.blockeraFontColor
			);

			//
			// Test 3: Clear Blockera value and check WP data
			//
			await clearColorControlValue(page, 'Text Color');

			const globalStylesRecord3 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root3 =
				globalStylesRecord3?.['core/group']?.variations['section-1'];
			const postDateInnerBlock3 = root3?.blocks?.['core/post-date'];
			const blockeraInnerBlocks3 = root3?.blockeraInnerBlocks?.value;
			const blockeraPostDateInnerBlock3 =
				blockeraInnerBlocks3?.['core/post-date']?.attributes;

			expect(undefined).toEqual(postDateInnerBlock3?.color?.text);
			expect(undefined).toEqual(
				blockeraPostDateInnerBlock3?.blockeraFontColor
			);
		});
	});
});
