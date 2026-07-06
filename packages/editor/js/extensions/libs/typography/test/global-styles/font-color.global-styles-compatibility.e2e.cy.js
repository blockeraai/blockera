/**
 * Font Color → WP Compatibility (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	getWPDataObject,
	activateMuPlugin,
	deactivateMuPlugin,
} from '@blockera/dev-cypress/js/helpers';

const FIXTURE_ROOT =
	'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures';

const muPluginByTestTitle = {
	'Simple Value': {
		path: `${FIXTURE_ROOT}/font-color-setup-1.php`,
		target: 'blockera-test-font-color-global-styles-simple.php',
	},
	'Variable Value': {
		path: `${FIXTURE_ROOT}/font-color-setup-2.php`,
		target: 'blockera-test-font-color-global-styles-variable.php',
	},
};

const activeMuPlugins = new Map();

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Font Color → WP Compatibility (Global Styles)', () => {
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
		describe('Simple Value', () => {
			it('Simple Value', () => {
				getWPDataObject().then((data) => {
					expect('#ffbaba').to.equal(
						getParagraphGlobalStyles(data)?.blockeraFontColor?.value
					);
				});

				cy.setColorControlValue('Text Color', '#666666');

				getWPDataObject().then((data) => {
					expect('#666666').to.equal(
						getParagraphGlobalStyles(data)?.color?.text
					);
				});

				cy.clearColorControlValue('Text Color');

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.color?.text);
					expect(undefined).to.equal(root?.blockeraFontColor?.value);
				});
			});
		});

		describe('Variable Value', () => {
			it('Variable Value', () => {
				cy.getParentContainer('Text Color').as('container');

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);

					expect({
						settings: {
							name: 'Accent 3',
							id: 'accent-3',
							value: '#503AA8',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'color',
							var: '--wp--preset--color--accent-3',
						},
						name: 'Accent 3',
						isValueAddon: true,
						valueType: 'variable',
					}).to.deep.equal(root?.blockeraFontColor?.value);
					expect('var(--wp--preset--color--accent-3)').to.equal(
						root?.color?.text
					);
				});

				cy.get('@container').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('contrast');

				getWPDataObject().then((data) => {
					expect('var(--wp--preset--color--accent-3)').to.equal(
						getParagraphGlobalStyles(data)?.color?.text
					);
				});

				cy.get('@container').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.color?.text);
					expect(undefined).to.equal(root?.blockeraFontColor?.value);
				});
			});
		});
	});
});
