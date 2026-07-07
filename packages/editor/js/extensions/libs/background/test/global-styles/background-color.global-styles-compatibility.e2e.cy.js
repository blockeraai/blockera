/**
 * Background Color → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/background/test/global-styles/fixtures';

const muPluginByTestTitle = {
	'Simple Value': {
		path: `${FIXTURE_ROOT}/background-color-setup-1.php`,
		target: 'blockera-test-bg-color-global-styles-simple.php',
	},
	'Variable Value': {
		path: `${FIXTURE_ROOT}/background-color-setup-2.php`,
		target: 'blockera-test-bg-color-global-styles-variable.php',
	},
	'Not found variable': {
		path: `${FIXTURE_ROOT}/background-color-setup-3.php`,
		target: 'blockera-test-bg-color-global-styles-unknown.php',
	},
};

const activeMuPlugins = new Map();

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

const openParagraphGlobalStyles = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
	cy.get('button[id="/blocks/core%2Fparagraph"]').click();
	cy.getByDataTest('style-default').click();
	cy.addNewTransition();
};

describe('Background Color → WP Compatibility (Global Styles)', () => {
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
		openParagraphGlobalStyles();
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
		it('Simple Value', () => {
			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				const blockeraBackgroundColor =
					getParagraphGlobalStyles(data)?.blockeraBackgroundColor
						?.value;

				expect('#ffdfdf').to.equal(blockeraBackgroundColor);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.setColorControlValue('BG Color', '#666666');

			getWPDataObject().then((data) => {
				const styleColorBackground =
					getParagraphGlobalStyles(data)?.color?.background;

				expect('#666666').to.equal(styleColorBackground);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.clearColorControlValue('BG Color');

			getWPDataObject().then((data) => {
				const root = getParagraphGlobalStyles(data);
				const styleColorBackground = root?.color?.background;
				const blockeraBackgroundColor =
					root?.blockeraBackgroundColor?.value;

				expect(undefined).to.equal(styleColorBackground);
				expect(undefined).to.equal(blockeraBackgroundColor);
			});
		});

		it('Variable Value', () => {
			cy.getParentContainer('BG Color').as('bgColorContainer');

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				const root = getParagraphGlobalStyles(data);
				const blockeraBackgroundColor =
					root?.blockeraBackgroundColor?.value;
				const backgroundColor = root?.color?.background;

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
				}).to.deep.equal(blockeraBackgroundColor);
				expect('var(--wp--preset--color--accent-3)').to.equal(
					backgroundColor
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.get('@bgColorContainer').within(() => {
				cy.clickValueAddonButton();
			});

			cy.selectValueAddonItem('contrast');

			getWPDataObject().then((data) => {
				const backgroundColor =
					getParagraphGlobalStyles(data)?.color?.background;

				expect('var:preset|color|contrast').to.equal(backgroundColor);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.get('@bgColorContainer').within(() => {
				cy.removeValueAddon();
			});

			getWPDataObject().then((data) => {
				const root = getParagraphGlobalStyles(data);
				const backgroundColor = root?.color?.background;
				const blockeraBackgroundColor =
					root?.blockeraBackgroundColor?.value;

				expect(undefined).to.equal(backgroundColor);
				expect(undefined).to.equal(blockeraBackgroundColor);
			});
		});

		it('Not found variable', () => {
			cy.getParentContainer('BG Color').as('bgColorContainer');

			//
			// Test 1: WP data to Blockera
			//

			getWPDataObject().then((data) => {
				const root = getParagraphGlobalStyles(data);
				const blockeraBackgroundColor =
					root?.blockeraBackgroundColor?.value;
				const backgroundColor = root?.color?.background;

				expect({
					settings: {
						name: 'unknown',
						id: 'var(--wp--preset--color--unknown)',
						value: 'var(--wp--preset--color--unknown)',
						type: 'color',
						var: '--wp--preset--color--unknown',
					},
					name: 'unknown',
					isValueAddon: true,
					valueType: 'variable',
				}).to.deep.equal(blockeraBackgroundColor);
				expect('var(--wp--preset--color--unknown)').to.equal(
					backgroundColor
				);
			});

			//
			// Test 2: Check interface for showing deleted value addon
			//

			cy.get('@bgColorContainer').within(() => {
				cy.get('[data-test="value-addon-deleted"]').should('exist');
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.get('@bgColorContainer').within(() => {
				cy.removeValueAddon();
			});

			getWPDataObject().then((data) => {
				const root = getParagraphGlobalStyles(data);
				const backgroundColor = root?.color?.background;
				const blockeraBackgroundColor =
					root?.blockeraBackgroundColor?.value;

				expect(undefined).to.equal(backgroundColor);
				expect(undefined).to.equal(blockeraBackgroundColor);
			});
		});
	});
});
