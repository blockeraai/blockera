/**
 * Text Orientation → WP Compatibility (Global Styles)
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

const FIXTURE_ROOT =
	'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures';

const muPluginByTestTitle = {
	'Horizontal value': {
		path: `${FIXTURE_ROOT}/text-orientation-setup-1.php`,
		target: 'blockera-test-text-orientation-global-styles-horizontal.php',
	},
	'Vertical value': {
		path: `${FIXTURE_ROOT}/text-orientation-setup-2.php`,
		target: 'blockera-test-text-orientation-global-styles-vertical.php',
	},
};

const activeMuPlugins = new Map();

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Text Orientation → WP Compatibility (Global Styles)', () => {
	beforeEach(function () {
		const muPlugin = muPluginByTestTitle[this.currentTest.title];

		if (muPlugin) {
			activateMuPlugin({
				pluginPath: muPlugin.path,
				pluginName: muPlugin.target,
			});
			activeMuPlugins.set(this.currentTest.title, muPlugin);
		}

		openSiteEditor();
		cy.openGlobalStylesPanel();
		closeWelcomeGuide();
		cy.getByDataTest('block-style-variations').eq(0).click();
		cy.get('button[id="/blocks/core%2Fparagraph"]').click();
		cy.getByDataTest('style-default').click();
		cy.addNewTransition();
		openMoreFeaturesControl('More typography settings');
	});

	afterEach(function () {
		const muPlugin = activeMuPlugins.get(this.currentTest.title);

		if (muPlugin) {
			deactivateMuPlugin({
				pluginPath: muPlugin.path,
				pluginName: muPlugin.target,
			});
			activeMuPlugins.delete(this.currentTest.title);
		}
	});

	describe('Paragraph Block', () => {
		describe('Horizontal value', () => {
			it('Horizontal value', () => {
				cy.getParentContainer('Orientation').as('container');

				assertBlockData((data) => {
					expect('initial').to.equal(
						getParagraphGlobalStyles(data)?.blockeraTextOrientation
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('button[data-value="style-1"]').click();
				});

				assertBlockData((data) => {
					expect('vertical-rl').to.equal(
						getParagraphGlobalStyles(data)?.typography?.writingMode
					);
				});

				cy.get('@container').within(() => {
					cy.get('button[data-value="initial"]').click();
				});

				assertBlockData((data) => {
					expect('horizontal-tb').to.equal(
						getParagraphGlobalStyles(data)?.typography?.writingMode
					);
				});

				cy.get('@container').within(() => {
					cy.get('button[data-value="initial"]').first().click({
						force: true,
					});
				});

				assertBlockData((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.writingMode);
					expect(undefined).to.equal(
						root?.blockeraTextOrientation?.value
					);
				});
			});
		});

		describe('Vertical value', () => {
			it('Vertical value', () => {
				cy.getParentContainer('Orientation').as('container');

				assertBlockData((data) => {
					expect('style-1').to.equal(
						getParagraphGlobalStyles(data)?.blockeraTextOrientation
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('button[data-value="initial"]').click();
				});

				assertBlockData((data) => {
					expect('horizontal-tb').to.equal(
						getParagraphGlobalStyles(data)?.typography?.writingMode
					);
				});

				cy.get('@container').within(() => {
					cy.get('button[data-value="style-1"]').click();
				});

				assertBlockData((data) => {
					const root = getParagraphGlobalStyles(data);
					expect('vertical-rl').to.equal(
						root?.typography?.writingMode
					);
					expect('style-1').to.equal(
						root?.blockeraTextOrientation?.value
					);
				});
			});
		});
	});
});
