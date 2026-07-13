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

const FIXTURE_ROOT =
	'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures';

const muPluginByTestTitle = {
	'Simple Value': {
		path: `${FIXTURE_ROOT}/line-height-setup-1.php`,
		target: 'blockera-test-line-height-global-styles-simple.php',
	},
	'Variable Value': {
		path: `${FIXTURE_ROOT}/line-height-setup-2.php`,
		target: 'blockera-test-line-height-global-styles-variable.php',
	},
	'Not found variable': {
		path: `${FIXTURE_ROOT}/line-height-setup-3.php`,
		target: 'blockera-test-line-height-global-styles-unknown.php',
	},
};

const activeMuPlugins = new Map();

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Line Height → WP Compatibility (Global Styles)', () => {
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
				cy.getParentContainer('Line Height').as('container');

				getWPDataObject().then((data) => {
					expect('1.8').to.equal(
						getParagraphGlobalStyles(data)?.blockeraLineHeight
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('input').first().clear({ force: true });
					cy.get('input').first().type('2.5{enter}', { force: true });
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

		describe('Variable Value', () => {
			it('Variable Value', () => {
				cy.getParentContainer('Line Height').as('container');

				// Wait until theme presets from the fixture resolve into the control.
				// Use exist (not visible): site-editor sidebar uses position:fixed and
				// can clip Line Height below the fold even after scrollIntoView.
				cy.get('@container').within(() => {
					cy.getByDataCy('value-addon-btn', { timeout: 20000 })
						.should('exist')
						.and('contain', 'Relaxed');
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);

					expect({
						settings: {
							name: 'Relaxed',
							id: 'relaxed',
							value: '1.6',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'line-height',
							var: '--wp--preset--line-height--relaxed',
						},
						name: 'Relaxed',
						isValueAddon: true,
						valueType: 'variable',
					}).to.deep.equal(root?.blockeraLineHeight?.value);
					expect('var(--wp--preset--line-height--relaxed)').to.equal(
						root?.typography?.lineHeight
					);
				});

				cy.get('@container').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('tight');

				getWPDataObject().then((data) => {
					expect('var:preset|line-height|tight').to.equal(
						getParagraphGlobalStyles(data)?.typography?.lineHeight
					);
				});

				cy.get('@container').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.lineHeight);
					expect(undefined).to.equal(root?.blockeraLineHeight?.value);
				});
			});
		});

		describe('Not found variable', () => {
			it('Not found variable', () => {
				cy.getParentContainer('Line Height').as('container');

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);

					expect({
						settings: {
							name: 'unknown',
							id: 'var(--wp--preset--line-height--unknown)',
							value: 'var(--wp--preset--line-height--unknown)',
							type: 'line-height',
							var: '--wp--preset--line-height--unknown',
						},
						name: 'unknown',
						isValueAddon: true,
						valueType: 'variable',
					}).to.deep.equal(root?.blockeraLineHeight?.value);
					expect('var(--wp--preset--line-height--unknown)').to.equal(
						root?.typography?.lineHeight
					);
				});

				cy.get('@container').within(() => {
					cy.get('[data-test="value-addon-deleted"]').should('exist');
					cy.clickValueAddonButton();
					cy.removeValueAddon();
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
