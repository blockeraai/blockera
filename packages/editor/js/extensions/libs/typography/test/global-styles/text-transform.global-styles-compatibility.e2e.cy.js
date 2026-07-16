/**
 * Text Transform → WP Compatibility (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	assertBlockData,
	activateMuPlugin,
	deactivateMuPlugin,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

const MU_PLUGIN_PATH =
	'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/text-transform-setup-1.php';
const MU_PLUGIN_TARGET =
	'blockera-test-text-transform-global-styles-simple.php';

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Text Transform → WP Compatibility (Global Styles)', () => {
	beforeEach(() => {
		activateMuPlugin({
			pluginPath: MU_PLUGIN_PATH,
			pluginName: MU_PLUGIN_TARGET,
		});
		openSiteEditor();
		cy.openGlobalStylesPanel();
		closeWelcomeGuide();
		cy.getByDataTest('block-style-variations').eq(0).click();
		cy.get('button[id="/blocks/core%2Fparagraph"]').eq(0).click();
		cy.getByDataTest('style-default').click();
		cy.addNewTransition();
		openMoreFeaturesControl('More typography settings');
	});

	afterEach(() => {
		deactivateMuPlugin({
			pluginPath: MU_PLUGIN_PATH,
			pluginName: MU_PLUGIN_TARGET,
		});
	});

	describe('Paragraph Block', () => {
		describe('Simple Value', () => {
			it('Simple Value', () => {
				cy.getParentContainer('Capitalize').as('container');

				assertBlockData((data) => {
					expect('uppercase').to.equal(
						getParagraphGlobalStyles(data)?.blockeraTextTransform
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('Capitalize').last().click();
				});

				assertBlockData((data) => {
					expect('capitalize').to.equal(
						getParagraphGlobalStyles(data)?.typography
							?.textTransform
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('Lowercase').click();
				});

				assertBlockData((data) => {
					expect('lowercase').to.equal(
						getParagraphGlobalStyles(data)?.typography
							?.textTransform
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('None').click();
				});

				assertBlockData((data) => {
					expect('initial').to.equal(
						getParagraphGlobalStyles(data)?.typography
							?.textTransform
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('None').click();
				});

				assertBlockData((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.textTransform);
					expect(undefined).to.equal(
						root?.blockeraTextTransform?.value
					);
				});
			});
		});
	});
});
