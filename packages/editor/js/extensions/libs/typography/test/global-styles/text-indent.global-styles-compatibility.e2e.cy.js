/**
 * Text Indent → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/text-indent-setup-1.php';
const MU_PLUGIN_TARGET = 'blockera-test-text-indent-global-styles-simple.php';

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Text Indent → WP Compatibility (Global Styles)', () => {
	beforeEach(() => {
		activateMuPlugin({
			pluginPath: MU_PLUGIN_PATH,
			pluginName: MU_PLUGIN_TARGET,
		});
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
		deactivateMuPlugin({
			pluginPath: MU_PLUGIN_PATH,
			pluginName: MU_PLUGIN_TARGET,
		});
	});

	describe('Paragraph Block', () => {
		describe('Simple Value', () => {
			it('Simple Value', () => {
				cy.getParentContainer('Text Indent').as('container');

				getWPDataObject().then((data) => {
					expect('2px').to.equal(
						getParagraphGlobalStyles(data)?.blockeraTextIndent
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('input').first().clear({ force: true });
					cy.get('input').first().type('3', { force: true });
				});

				getWPDataObject().then((data) => {
					expect('3px').to.equal(
						getParagraphGlobalStyles(data)?.typography?.textIndent
					);
				});

				cy.get('@container').within(() => {
					cy.get('input').first().clear({ force: true });
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.textIndent);
					expect(undefined).to.equal(root?.blockeraTextIndent?.value);
				});
			});
		});
	});
});
