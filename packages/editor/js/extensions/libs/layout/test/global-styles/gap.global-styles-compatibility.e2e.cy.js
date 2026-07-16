/**
 * Gap → WP Compatibility (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	assertBlockData,
	activateMuPlugin,
	deactivateMuPlugin,
} from '@blockera/dev-cypress/js/helpers';

const MU_PLUGIN_PATH =
	'packages/editor/js/extensions/libs/layout/test/global-styles/fixtures/gap-setup-1.php';
const MU_PLUGIN_TARGET = 'blockera-test-gap-global-styles-simple.php';

const getGroupGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/group'];

const openGroupGlobalStyles = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
	cy.get('button[id="/blocks/core%2Fgroup"]').click();
	cy.getByDataTest('style-default').click();
	cy.addNewTransition();
};

describe('Gap → WP Compatibility (Global Styles)', () => {
	beforeEach(() => {
		activateMuPlugin({
			pluginPath: MU_PLUGIN_PATH,
			pluginName: MU_PLUGIN_TARGET,
		});
		openSiteEditor();
		openGroupGlobalStyles();
	});

	afterEach(() => {
		deactivateMuPlugin({
			pluginPath: MU_PLUGIN_PATH,
			pluginName: MU_PLUGIN_TARGET,
		});
	});

	describe('Group Block', () => {
		describe('Simple Value', () => {
			it('Simple Value', () => {
				cy.getParentContainer('Gap').as('gapContainer');

				//
				// Test 1: WP data to Blockera
				//

				assertBlockData((data) => {
					const blockeraGap =
						getGroupGlobalStyles(data)?.blockeraGap?.value;

					expect({
						lock: true,
						gap: '30px',
						columns: '',
						rows: '',
					}).to.deep.equal(blockeraGap);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@gapContainer').within(() => {
					cy.get('input').clear({ force: true });
					cy.get('input').type('40', { force: true });
				});

				assertBlockData((data) => {
					const root = getGroupGlobalStyles(data);
					const spacingBlockGap = root?.spacing?.blockGap;
					const blockeraGap = root?.blockeraGap?.value;

					expect({
						lock: true,
						gap: '40px',
						columns: '',
						rows: '',
					}).to.deep.equal(blockeraGap);
					expect('40px').to.equal(spacingBlockGap);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.get('@gapContainer').within(() => {
					cy.get('input').clear({ force: true });
				});

				assertBlockData((data) => {
					const root = getGroupGlobalStyles(data);
					const spacingBlockGap = root?.spacing?.blockGap;
					const blockeraGap = root?.blockeraGap?.value;

					expect(undefined).to.equal(spacingBlockGap);
					expect(undefined).to.equal(blockeraGap);
				});
			});
		});
	});
});
