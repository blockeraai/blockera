/**
 * Text Transform → WP Compatibility (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	getWPDataObject,
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
		activateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
		openSiteEditor();
		cy.openGlobalStylesPanel();
		closeWelcomeGuide();
		cy.getByDataTest('block-style-variations').eq(1).click();
		cy.get('button[id="/blocks/core%2Fparagraph"]').click();
		cy.getByDataTest('style-default').click();
		cy.addNewTransition();
		openMoreFeaturesControl('More typography settings');
	});

	afterEach(() => {
		deactivateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
	});

	describe('Paragraph Block', () => {
		describe('Simple Value', () => {
			it('Simple Value', () => {
				cy.getParentContainer('Capitalize').as('container');

				getWPDataObject().then((data) => {
					expect('uppercase').to.equal(
						getParagraphGlobalStyles(data)?.blockeraTextTransform
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('Capitalize').click();
				});

				getWPDataObject().then((data) => {
					expect('capitalize').to.equal(
						getParagraphGlobalStyles(data)?.typography
							?.textTransform
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('Lowercase').click();
				});

				getWPDataObject().then((data) => {
					expect('lowercase').to.equal(
						getParagraphGlobalStyles(data)?.typography
							?.textTransform
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('None').click();
				});

				getWPDataObject().then((data) => {
					expect('initial').to.equal(
						getParagraphGlobalStyles(data)?.typography
							?.textTransform
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('None').click();
				});

				getWPDataObject().then((data) => {
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
