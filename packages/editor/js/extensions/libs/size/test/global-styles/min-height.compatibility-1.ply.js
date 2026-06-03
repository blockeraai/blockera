/**
 * Min Height → WP Compatibility (Global Styles)
 * Playwright e2e test
 */
const {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	activateMuPlugin,
	deactivateMuPlugin,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	addNewTransition,
	getParentContainer,
	openGlobalStylesPanel,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Min Height → WP Compatibility (Global Styles)', () => {
	const activeMuPlugins = new Map();

	test.afterEach(async ({ page }, testInfo) => {
		const muPluginPath = activeMuPlugins.get(testInfo.testId);

		if (muPluginPath) {
			await deactivateMuPlugin(page, muPluginPath);
			activeMuPlugins.delete(testInfo.testId);
		}
	});

	test.describe('Cover Block', () => {
		const muPluginPath =
			'packages/editor/js/extensions/libs/size/test/global-styles/fixtures/min-height-setup-1.php';

		test.beforeEach(async ({ page, admin }, testInfo) => {
			await activateMuPlugin(page, muPluginPath);
			activeMuPlugins.set(testInfo.testId, muPluginPath);

			await openSiteEditor(page, admin);
			await openGlobalStylesPanel(page);
			await closeWelcomeGuide(page);
			await getByDataTest(page, 'block-style-variations').first().click();
			await page.locator('button[id="/blocks/core%2Fcover"]').click();
		});

		test.describe('Simple Value', () => {
			test('Simple Value', async ({ page }) => {
				await getByDataTest(page, 'style-default').click();

				await addNewTransition(page);

				const globalStylesRecord = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root = globalStylesRecord?.['core/cover'];
				const blockeraMinHeight1 = root?.blockeraMinHeight?.value;

				expect('300px').toEqual(blockeraMinHeight1);

				const minHeightContainer = await getParentContainer(
					page,
					'Min Height'
				);

				await minHeightContainer.locator('input').nth(1).fill('400px');

				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/cover'];
				const dimensionsMinHeight = root2?.dimensions?.minHeight;

				expect('400px').toEqual(dimensionsMinHeight);

				await minHeightContainer.locator('input').nth(1).clear();

				await page.waitForTimeout(500);

				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/cover'];
				const dimensionsMinHeight3 = root3?.dimensions?.minHeight;
				const blockeraMinHeight3 = root3?.blockeraMinHeight?.value;

				// User override cleared: not the edited value; theme baseline or empty.
				expect('400px').not.toEqual(dimensionsMinHeight3);
				expect(['300px', undefined]).toContain(dimensionsMinHeight3);
				expect(['300px', undefined]).toContain(blockeraMinHeight3);
			});
		});
	});

	test.describe('Group Block', () => {
		const muPluginPath =
			'packages/editor/js/extensions/libs/size/test/global-styles/fixtures/min-height-setup-group-1.php';

		test.beforeEach(async ({ page, admin }, testInfo) => {
			await activateMuPlugin(page, muPluginPath);
			activeMuPlugins.set(testInfo.testId, muPluginPath);

			await openSiteEditor(page, admin);
			await openGlobalStylesPanel(page);
			await closeWelcomeGuide(page);
			await getByDataTest(page, 'block-style-variations').first().click();
			await page.locator('button[id="/blocks/core%2Fgroup"]').click();
		});

		test.describe('Group Simple Value', () => {
			test('Group Simple Value', async ({ page }) => {
				await getByDataTest(page, 'style-default').click();

				await addNewTransition(page);

				const globalStylesRecord = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root = globalStylesRecord?.['core/group'];
				const blockeraMinHeight1 = root?.blockeraMinHeight?.value;

				expect('300px').toEqual(blockeraMinHeight1);

				const minHeightContainer = await getParentContainer(
					page,
					'Min Height'
				);

				await minHeightContainer.locator('input').nth(1).fill('400px');

				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/group'];
				const dimensionsMinHeight = root2?.dimensions?.minHeight;

				expect('400px').toEqual(dimensionsMinHeight);

				await minHeightContainer.locator('input').nth(1).clear();

				await page.waitForTimeout(500);

				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/group'];
				const dimensionsMinHeight3 = root3?.dimensions?.minHeight;
				const blockeraMinHeight3 = root3?.blockeraMinHeight?.value;

				// User override cleared: not the edited value; theme baseline or empty.
				expect('400px').not.toEqual(dimensionsMinHeight3);
				expect(['300px', undefined]).toContain(dimensionsMinHeight3);
				expect(['300px', undefined]).toContain(blockeraMinHeight3);
			});
		});
	});
});
