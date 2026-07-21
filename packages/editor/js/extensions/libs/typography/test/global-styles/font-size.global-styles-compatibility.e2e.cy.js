/**
 * Font Size → WP Compatibility (Global Styles)
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
		path: `${FIXTURE_ROOT}/font-size-setup-1.php`,
		target: 'blockera-test-font-size-global-styles-simple.php',
	},
	'Variable Value': {
		path: `${FIXTURE_ROOT}/font-size-setup-2.php`,
		target: 'blockera-test-font-size-global-styles-variable.php',
	},
	'Not found variable': {
		path: `${FIXTURE_ROOT}/font-size-setup-3.php`,
		target: 'blockera-test-font-size-global-styles-unknown.php',
	},
};

const activeMuPlugins = new Map();

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Font Size → WP Compatibility (Global Styles)', () => {
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
				cy.getParentContainer('Font Size').as('container');

				getWPDataObject().then((data) => {
					expect('24px').to.equal(
						getParagraphGlobalStyles(data)?.blockeraFontSize?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('input').first().clear({ force: true });
					cy.get('input').first().type('18', { force: true });
				});

				getWPDataObject().then((data) => {
					expect('18px').to.equal(
						getParagraphGlobalStyles(data)?.typography?.fontSize
					);
				});

				cy.get('@container').within(() => {
					cy.get('input').first().clear({ force: true });
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.fontSize);
					expect(undefined).to.equal(root?.blockeraFontSize?.value);
				});
			});
		});

		describe('Variable Value', () => {
			it('Variable Value', () => {
				cy.getParentContainer('Font Size').as('container');

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);

					expect({
						settings: {
							name: 'Large',
							id: 'large',
							value: '1.38rem',
							fluid: {
								max: '1.375rem',
								min: '1.125rem',
							},
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'font-size',
							var: '--wp--preset--font-size--large',
						},
						name: 'Large',
						isValueAddon: true,
						valueType: 'variable',
					}).to.deep.equal(root?.blockeraFontSize?.value);
					expect('var(--wp--preset--font-size--large)').to.equal(
						root?.typography?.fontSize
					);
				});

				cy.get('@container').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('medium');

				getWPDataObject().then((data) => {
					expect('var:preset|font-size|medium').to.equal(
						getParagraphGlobalStyles(data)?.typography?.fontSize
					);
				});

				cy.get('@container').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.fontSize);
					expect(undefined).to.equal(root?.blockeraFontSize?.value);
				});
			});
		});

		describe('Not found variable', () => {
			it('Not found variable', () => {
				cy.getParentContainer('Font Size').as('container');

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);

					expect({
						settings: {
							name: 'unknown',
							fluid: null,
							id: 'var(--wp--preset--font-size--unknown)',
							value: 'var(--wp--preset--font-size--unknown)',
							type: 'font-size',
							var: '--wp--preset--font-size--unknown',
						},
						name: 'unknown',
						isValueAddon: true,
						valueType: 'variable',
					}).to.deep.equal(root?.blockeraFontSize?.value);
					expect('var(--wp--preset--font-size--unknown)').to.equal(
						root?.typography?.fontSize
					);
				});

				cy.get('@container').within(() => {
					cy.get('[data-test="value-addon-deleted"]').should('exist');
					cy.clickValueAddonButton();
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.fontSize);
					expect(undefined).to.equal(root?.blockeraFontSize?.value);
				});
			});
		});
	});
});
