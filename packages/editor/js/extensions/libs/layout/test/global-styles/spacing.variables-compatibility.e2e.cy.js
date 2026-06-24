/**
 * Spacing → WP Compatibility (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	getWPDataObject,
	activateMuPlugin,
	deactivateMuPlugin,
	setBoxSpacingSide,
	clearBoxSpacingSide,
} from '@blockera/dev-cypress/js/helpers';

const MU_PLUGIN_PATH =
	'packages/editor/js/extensions/libs/layout/test/global-styles/fixtures/spacing-setup-1.php';
const MU_PLUGIN_TARGET = 'blockera-test-spacing-global-styles-simple.php';

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

const openParagraphGlobalStyles = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(1).click();
	cy.get('button[id="/blocks/core%2Fparagraph"]').click();
	cy.getByDataTest('style-default').click();
	cy.addNewTransition();
};

describe('Spacing → WP Compatibility (Global Styles)', () => {
	beforeEach(() => {
		activateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
		openSiteEditor();
		openParagraphGlobalStyles();
	});

	afterEach(() => {
		deactivateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
	});

	describe('Paragraph Block', () => {
		describe('Simple Value', () => {
			it('Simple Value', () => {
				//
				// Test 1: WP data to Blockera
				//

				getWPDataObject().then((data) => {
					const blockeraSpacing =
						getParagraphGlobalStyles(data)?.blockeraSpacing?.value;

					expect({
						padding: {
							top: '20px',
							right: '30px',
							bottom: '40px',
							left: '50px',
						},
						margin: {
							top: '10px',
							right: '15px',
							bottom: '20px',
							left: '25px',
						},
					}).to.deep.equal(blockeraSpacing);
				});

				//
				// Test 2: Blockera value to WP data
				//

				setBoxSpacingSide('padding-top', '25');

				getWPDataObject().then((data) => {
					const spacingPaddingTop =
						getParagraphGlobalStyles(data)?.spacing?.padding?.top;

					expect('25px').to.equal(spacingPaddingTop);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				clearBoxSpacingSide('padding-top');

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					const spacingPaddingTop = root?.spacing?.padding?.top;
					const blockeraSpacing = root?.blockeraSpacing?.value;

					expect('').to.equal(spacingPaddingTop);
					expect({
						padding: {
							right: '30px',
							bottom: '40px',
							left: '50px',
						},
						margin: {
							top: '10px',
							right: '15px',
							bottom: '20px',
							left: '25px',
						},
					}).to.deep.equal(blockeraSpacing);
				});
			});
		});
	});
});
