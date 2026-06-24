/**
 * Text Align → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/text-align-setup-1.php';
const MU_PLUGIN_TARGET = 'blockera-test-text-align-global-styles-simple.php';

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Text Align → WP Compatibility (Global Styles)', () => {
	beforeEach(() => {
		activateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
		openSiteEditor();
		cy.openGlobalStylesPanel();
		closeWelcomeGuide();
		cy.getByDataTest('block-style-variations').eq(0).click();
		cy.get('button[id="/blocks/core%2Fparagraph"]').click();
		cy.getByDataTest('style-default').click();
		cy.addNewTransition();
	});

	afterEach(() => {
		deactivateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
	});

	describe('Paragraph Block', () => {
		describe('Simple Value', () => {
			it('Simple Value', () => {
				cy.getParentContainer('Text Align').as('container');

				getWPDataObject().then((data) => {
					expect('center').to.equal(
						getParagraphGlobalStyles(data)?.blockeraTextAlign?.value
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('Right').click();
				});

				getWPDataObject().then((data) => {
					expect('right').to.equal(
						getParagraphGlobalStyles(data)?.typography?.textAlign
					);
				});

				cy.get('@container').within(() => {
					cy.getByAriaLabel('Right').click();
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.textAlign);
					expect(undefined).to.equal(root?.blockeraTextAlign?.value);
				});
			});
		});
	});
});
