/**
 * Background Repeat → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-repeat-setup-1.php';
const MU_PLUGIN_TARGET = 'blockera-test-bg-repeat-global-styles-no-repeat.php';

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

describe('Background Repeat → WP Compatibility (Global Styles)', () => {
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
		describe('Background Repeat', () => {
			it('No Repeat Value', () => {
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				//
				// Test 1: WP data to Blockera
				//

				assertBlockData((data) => {
					const blockeraBackground =
						getGroupGlobalStyles(data)?.blockeraBackground;

					expect({
						value: {
							'image-0': {
								isVisible: true,
								type: 'image',
								image: 'https://placehold.co/600x400',
								'image-size': 'custom',
								'image-size-width': 'auto',
								'image-size-height': 'auto',
								'image-position': {
									top: '50%',
									left: '50%',
								},
								'image-repeat': 'no-repeat',
								'image-attachment': 'scroll',
								order: 0,
							},
						},
					}).to.deep.equal(blockeraBackground);
				});

				//
				// Test 2: Blockera value to WP data
				//

				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').click();
				});

				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('button[data-value="repeat"]').click();
					});

				assertBlockData((data) => {
					const backgroundRepeat =
						getGroupGlobalStyles(data)?.background
							?.backgroundRepeat;

					expect(undefined).to.equal(backgroundRepeat);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete image 0').click({ force: true });
				});

				assertBlockData((data) => {
					const root = getGroupGlobalStyles(data);
					const backgroundRepeat = root?.background?.backgroundRepeat;
					const blockeraBackground = root?.blockeraBackground;

					expect(undefined).to.equal(backgroundRepeat);
					expect(undefined).to.equal(blockeraBackground);
				});
			});
		});
	});
});
