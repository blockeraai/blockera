/**
 * Shadow → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/border-and-shadow/test/global-styles/fixtures';

const muPluginByTestTitle = {
	'Simple shadow value': {
		path: `${FIXTURE_ROOT}/shadow-setup-1.php`,
		target: 'blockera-test-shadow-global-styles-simple.php',
	},
	'Shadow preset reference': {
		path: `${FIXTURE_ROOT}/shadow-setup-2.php`,
		target: 'blockera-test-shadow-global-styles-preset.php',
	},
};

const activeMuPlugins = new Map();

const getButtonGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/button'];

const openButtonGlobalStyles = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(1).click();
	cy.get('button[id="/blocks/core%2Fbutton"]').click();
	cy.getByDataTest('style-fill').click();
	cy.addNewTransition();
};

describe('Shadow → WP Compatibility (Global Styles)', () => {
	beforeEach(function () {
		const muPlugin = muPluginByTestTitle[this.currentTest.title];

		if (muPlugin) {
			activateMuPlugin(muPlugin.path, muPlugin.target);
			activeMuPlugins.set(this.currentTest.title, muPlugin);
		}

		openSiteEditor();
		openButtonGlobalStyles();
	});

	afterEach(function () {
		const muPlugin = activeMuPlugins.get(this.currentTest.title);

		if (muPlugin) {
			deactivateMuPlugin(muPlugin.path, muPlugin.target);
			activeMuPlugins.delete(this.currentTest.title);
		}
	});

	describe('Button Block', () => {
		describe('Simple Value', () => {
			it('Simple shadow value', () => {
				cy.getParentContainer('Box Shadows').as('shadowContainer');

				getWPDataObject().then((data) => {
					const root = getButtonGlobalStyles(data);
					const blockeraBoxShadow = root?.blockeraBoxShadow?.value;
					const shadow = root?.shadow;

					expect(blockeraBoxShadow).to.not.equal(undefined);
					expect(
						Object.keys(blockeraBoxShadow).length
					).to.be.greaterThan(0);

					const firstShadowKey = Object.keys(blockeraBoxShadow)[0];
					const firstShadow = blockeraBoxShadow[firstShadowKey];

					expect(firstShadow.isVisible).to.equal(true);
					expect(firstShadow.type).to.equal('outer');
					expect(firstShadow.x).to.equal('10px');
					expect(firstShadow.y).to.equal('20px');
					expect(firstShadow.blur).to.equal('5px');
					expect(firstShadow.spread).to.equal('0px');
					expect(firstShadow.color).to.equal('rgba(0, 0, 0, 0.3)');
					expect(shadow).to.equal(
						'10px 20px 5px 0px rgba(0, 0, 0, 0.3)'
					);
				});

				cy.get('@shadowContainer').within(() => {
					cy.get('[data-id="outer-0"]').click();
				});

				cy.get('.blockera-component-popover')
					.last()
					.within(() => {
						cy.getByDataTest('box-shadow-x-input').clear({
							force: true,
						});
						cy.getByDataTest('box-shadow-x-input').type('15', {
							force: true,
						});
						cy.getByDataTest('box-shadow-y-input').clear({
							force: true,
						});
						cy.getByDataTest('box-shadow-y-input').type('25', {
							force: true,
						});
						cy.getByDataTest('box-shadow-blur-input').clear({
							force: true,
						});
						cy.getByDataTest('box-shadow-blur-input').type('10', {
							force: true,
						});
					});

				getWPDataObject().then((data) => {
					const shadow = getButtonGlobalStyles(data)?.shadow;

					expect(undefined).to.equal(shadow);
				});

				cy.get('@shadowContainer').within(() => {
					cy.getByAriaLabel('Delete outer 0').click({ force: true });
				});

				getWPDataObject().then((data) => {
					const blockeraBoxShadow =
						getButtonGlobalStyles(data)?.blockeraBoxShadow;

					expect(undefined).to.equal(blockeraBoxShadow);
				});
			});

			it('Shadow preset reference', () => {
				cy.getParentContainer('Box Shadows').as('shadowContainer');

				getWPDataObject().then((data) => {
					const root = getButtonGlobalStyles(data);
					const blockeraBoxShadow = root?.blockeraBoxShadow?.value;
					const shadow = root?.shadow;

					expect(blockeraBoxShadow).to.not.equal(undefined);
					expect(
						Object.keys(blockeraBoxShadow).length
					).to.be.greaterThan(0);

					const firstShadowKey = Object.keys(blockeraBoxShadow)[0];
					const firstShadow = blockeraBoxShadow[firstShadowKey];

					expect(firstShadow.isVisible).to.equal(true);
					expect(firstShadow.type).to.equal('outer');
					expect(typeof firstShadow.color).to.equal('string');
					expect(firstShadow.color).to.equal('rgba(0, 0, 0, 0.2)');
					expect(shadow).to.equal(
						'var(--wp--preset--shadow--natural)'
					);
				});

				cy.get('@shadowContainer').within(() => {
					cy.get('[data-id="outer-0"]').click();
				});

				cy.get('.blockera-component-popover')
					.last()
					.within(() => {
						cy.getByDataTest('box-shadow-x-input').clear({
							force: true,
						});
						cy.getByDataTest('box-shadow-x-input').type('5', {
							force: true,
						});
					});

				getWPDataObject().then((data) => {
					const shadow = getButtonGlobalStyles(data)?.shadow;

					expect(undefined).to.equal(shadow);
				});
			});
		});
	});
});
