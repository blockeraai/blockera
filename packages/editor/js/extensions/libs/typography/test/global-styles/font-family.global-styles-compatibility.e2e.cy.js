/**
 * Font Family → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/font-family-setup-1.php';
const MU_PLUGIN_TARGET = 'blockera-test-font-family-global-styles-simple.php';

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Font Family → WP Compatibility (Global Styles)', () => {
	beforeEach(() => {
		activateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
		openSiteEditor();
		cy.openGlobalStylesPanel();
		closeWelcomeGuide();
		cy.getByDataTest('block-style-variations').eq(1).click();
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
				cy.getParentContainer('Font Family').as('container');

				getWPDataObject().then((data) => {
					expect('Georgia, serif').to.equal(
						getParagraphGlobalStyles(data)?.blockeraFontFamily
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('select').first().select('fira-code');
				});

				getWPDataObject().then((data) => {
					expect('fira-code').to.equal(
						getParagraphGlobalStyles(data)?.typography?.fontFamily
					);
				});

				cy.get('@container').within(() => {
					cy.get('select').first().select('', { force: true });
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.fontFamily);
					expect(undefined).to.equal(root?.blockeraFontFamily?.value);
				});
			});
		});
	});
});
