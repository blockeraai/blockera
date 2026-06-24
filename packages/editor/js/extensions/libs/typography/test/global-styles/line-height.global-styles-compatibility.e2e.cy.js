/**
 * Line Height → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/line-height-setup-1.php';
const MU_PLUGIN_TARGET = 'blockera-test-line-height-global-styles-simple.php';

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Line Height → WP Compatibility (Global Styles)', () => {
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
				cy.getParentContainer('Line Height').as('container');

				getWPDataObject().then((data) => {
					expect('1.8').to.equal(
						getParagraphGlobalStyles(data)?.blockeraLineHeight
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('input').first().clear({ force: true });
					cy.get('input').first().type('2.5', { force: true });
				});

				getWPDataObject().then((data) => {
					expect('2.5').to.equal(
						getParagraphGlobalStyles(data)?.typography?.lineHeight
					);
				});

				cy.get('@container').within(() => {
					cy.get('input').first().clear({ force: true });
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.lineHeight);
					expect(undefined).to.equal(root?.blockeraLineHeight?.value);
				});
			});
		});
	});
});
