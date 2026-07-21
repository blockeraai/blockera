/**
 * Background Size → WP Compatibility (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	getWPDataObject,
	activateMuPlugin,
	deactivateMuPlugin,
} from '@blockera/dev-cypress/js/helpers';

const MU_PLUGIN_PATH =
	'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-size-setup-1.php';
const MU_PLUGIN_TARGET = 'blockera-test-bg-size-global-styles-cover.php';

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

describe('Background Size → WP Compatibility (Global Styles)', () => {
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
		describe('Background Size', () => {
			it('Cover Value', () => {
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					const blockeraBackground =
						getGroupGlobalStyles(data)?.blockeraBackground;

					expect({
						value: {
							'image-0': {
								isVisible: true,
								type: 'image',
								image: 'https://placehold.co/600x400',
								'image-size': 'cover',
								'image-size-width': 'auto',
								'image-size-height': 'auto',
								'image-position': {
									top: '50%',
									left: '50%',
								},
								'image-repeat': 'repeat',
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
						cy.get('[data-value="contain"]').click();
					});

				getWPDataObject().then((data) => {
					const backgroundSize =
						getGroupGlobalStyles(data)?.background?.backgroundSize;

					expect('contain').to.equal(backgroundSize);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete image 0').click({ force: true });
				});

				getWPDataObject().then((data) => {
					const root = getGroupGlobalStyles(data);
					const backgroundSize = root?.background?.backgroundSize;
					const blockeraBackground = root?.blockeraBackground;

					expect(undefined).to.equal(backgroundSize);
					expect(undefined).to.equal(blockeraBackground);
				});
			});
		});
	});
});
