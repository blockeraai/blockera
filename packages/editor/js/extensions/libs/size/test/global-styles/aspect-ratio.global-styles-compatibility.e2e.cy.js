/**
 * Aspect Ratio → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/size/test/global-styles/fixtures/aspect-ratio-setup-1.php';
const MU_PLUGIN_TARGET = 'blockera-test-aspect-ratio-global-styles-simple.php';

const getCoverGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/cover'];

const openCoverGlobalStyles = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(1).click();
	cy.get('button[id="/blocks/core%2Fcover"]').click();
	cy.getByDataTest('style-default').click();
	cy.addNewTransition();
};

describe('Aspect Ratio → WP Compatibility (Global Styles)', () => {
	beforeEach(() => {
		activateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
		openSiteEditor();
		openCoverGlobalStyles();
	});

	afterEach(() => {
		deactivateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
	});

	describe('Cover Block', () => {
		describe('Simple Value', () => {
			it('Simple Value', () => {
				cy.getParentContainer('Aspect Ratio').as(
					'aspectRatioContainer'
				);

				getWPDataObject().then((data) => {
					expect({
						val: '3/2',
						width: '',
						height: '',
					}).to.deep.equal(
						getCoverGlobalStyles(data)?.blockeraRatio?.value
					);
				});

				cy.get('@aspectRatioContainer').within(() => {
					cy.get('select').select('16/9');
				});

				getWPDataObject().then((data) => {
					expect('16/9').to.equal(
						getCoverGlobalStyles(data)?.dimensions?.aspectRatio
					);
				});

				cy.get('@aspectRatioContainer').within(() => {
					cy.get('select').select('', { force: true });
				});

				getWPDataObject().then((data) => {
					const root = getCoverGlobalStyles(data);

					expect(undefined).to.equal(root?.dimensions?.aspectRatio);
					expect(undefined).to.equal(root?.blockeraRatio?.value);
				});
			});
		});
	});
});
