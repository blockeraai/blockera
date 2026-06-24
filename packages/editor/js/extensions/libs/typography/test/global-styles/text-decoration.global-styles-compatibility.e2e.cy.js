/**
 * Text Decoration → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/text-decoration-setup-1.php';
const MU_PLUGIN_TARGET =
	'blockera-test-text-decoration-global-styles-simple.php';

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Text Decoration → WP Compatibility (Global Styles)', () => {
	beforeEach(() => {
		activateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
		openSiteEditor();
		cy.openGlobalStylesPanel();
		closeWelcomeGuide();
		cy.getByDataTest('block-style-variations').eq(0).click();
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
				cy.getParentContainer('Decoration').as('container');

				getWPDataObject().then((data) => {
					expect('underline').to.equal(
						getParagraphGlobalStyles(data)?.blockeraTextDecoration
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('Line Through').click();
				});

				getWPDataObject().then((data) => {
					expect('line-through').to.equal(
						getParagraphGlobalStyles(data)?.typography
							?.textDecoration
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('Overline').click();
				});

				getWPDataObject().then((data) => {
					expect('overline').to.equal(
						getParagraphGlobalStyles(data)?.typography
							?.textDecoration
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('None').click();
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(
						root?.typography?.textDecoration
					);
					expect('initial').to.equal(
						root?.blockeraTextDecoration?.value
					);
				});
			});
		});
	});
});
