/**
 * Border & Border Radius Together → WP Compatibility (Global Styles)
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
	'Compacted borders': {
		path: `${FIXTURE_ROOT}/border-and-radius-setup-1.php`,
		target: 'blockera-test-border-radius-global-styles-compacted.php',
	},
	'Custom side borders': {
		path: `${FIXTURE_ROOT}/border-and-radius-setup-2.php`,
		target: 'blockera-test-border-radius-global-styles-custom.php',
	},
};

const activeMuPlugins = new Map();

const getButtonGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/button'];

const openButtonGlobalStyles = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
	cy.get('button[id="/blocks/core%2Fbutton"]').click();
	cy.getByDataTest('style-fill').click();
	cy.addNewTransition();
};

describe('Border & Border Radius Together → WP Compatibility (Global Styles)', () => {
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
			it('Compacted borders', () => {
				cy.getParentContainer('Border').as('border');
				cy.getParentContainer('Radius').as('radius');

				getWPDataObject().then((data) => {
					const root = getButtonGlobalStyles(data);

					expect({
						type: 'all',
						all: {
							color: '#ff4848',
							width: '1px',
							style: 'solid',
						},
					}).to.deep.equal(root?.blockeraBorder?.value);
					expect({
						type: 'all',
						all: '10px',
					}).to.deep.equal(root?.blockeraBorderRadius?.value);
					expect({
						radius: '10px',
						style: 'solid',
						color: '#ff4848',
						width: '1px',
					}).to.deep.equal(root?.border);
				});

				cy.get('@border').within(() => {
					cy.get('input').clear({ force: true });
					cy.get('input').type('20', { force: true, delay: 0 });
				});

				cy.get('@radius').within(() => {
					cy.get('input').clear({ force: true });
					cy.get('input').type('20', { force: true, delay: 0 });
				});

				getWPDataObject().then((data) => {
					const root = getButtonGlobalStyles(data);

					expect({
						type: 'all',
						all: {
							color: '#ff4848',
							width: '20px',
							style: 'solid',
						},
					}).to.deep.equal(root?.blockeraBorder?.value);
					expect({
						type: 'all',
						all: '20px',
					}).to.deep.equal(root?.blockeraBorderRadius?.value);
					expect({
						color: '#ff4848',
						width: '20px',
						style: 'solid',
						radius: '20px',
						top: undefined,
						right: undefined,
						bottom: undefined,
						left: undefined,
					}).to.deep.equal(root?.border);
				});

				cy.get('@border').within(() => {
					cy.get('input').clear({ force: true, delay: 0 });
					cy.getByDataTest('border-control-color').click();
				});

				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.getByAriaLabel('Reset Color (Clear)').click({
							force: true,
						});
					});

				cy.get('@radius').within(() => {
					cy.get('input').clear({ force: true });
				});

				getWPDataObject().then((data) => {
					const root = getButtonGlobalStyles(data);

					expect(undefined).to.equal(root?.blockeraBorder?.value);
					expect(undefined).to.equal(root?.border);
				});
			});

			it('Custom side borders', () => {
				cy.getParentContainer('Border').as('border');
				cy.getParentContainer('Radius').as('radius');

				getWPDataObject().then((data) => {
					const root = getButtonGlobalStyles(data);

					expect({
						type: 'custom',
						all: {
							width: '',
							style: '',
							color: '',
						},
						top: {
							width: '1px',
							color: '#ff4848',
							style: 'solid',
						},
						right: {
							width: '2px',
							color: '#ff4848',
							style: 'solid',
						},
						bottom: {
							width: '3px',
							color: '#ff4848',
							style: 'solid',
						},
						left: {
							width: '4px',
							color: '#ff4848',
							style: 'solid',
						},
					}).to.deep.equal(root?.blockeraBorder?.value);
					expect({
						topLeft: '10px',
						topRight: '20px',
						bottomLeft: '40px',
						bottomRight: '30px',
						type: 'custom',
						all: '',
					}).to.deep.equal(root?.blockeraBorderRadius?.value);
					expect({
						radius: {
							topLeft: '10px',
							topRight: '20px',
							bottomLeft: '40px',
							bottomRight: '30px',
						},
						top: {
							style: 'solid',
							color: '#ff4848',
							width: '1px',
						},
						right: {
							style: 'solid',
							color: '#ff4848',
							width: '2px',
						},
						bottom: {
							style: 'solid',
							color: '#ff4848',
							width: '3px',
						},
						left: {
							style: 'solid',
							color: '#ff4848',
							width: '4px',
						},
					}).to.deep.equal(root?.border);
				});

				cy.get('@border').within(() => {
					cy.get('input').eq(0).clear({ force: true, delay: 0 });
					cy.get('input').eq(0).type('10', { force: true, delay: 0 });
					cy.get('input').eq(1).clear({ force: true, delay: 0 });
					cy.get('input').eq(1).type('20', { force: true, delay: 0 });
					cy.get('input').eq(2).clear({ force: true, delay: 0 });
					cy.get('input').eq(2).type('30', { force: true, delay: 0 });
					cy.get('input').eq(3).clear({ force: true, delay: 0 });
					cy.get('input').eq(3).type('40', { force: true, delay: 0 });
				});

				cy.get('@radius').within(() => {
					cy.get('input').eq(0).clear({ force: true, delay: 0 });
					cy.get('input').eq(0).type('50', { force: true, delay: 0 });
					cy.get('input').eq(1).clear({ force: true, delay: 0 });
					cy.get('input').eq(1).type('60', { force: true, delay: 0 });
					cy.get('input').eq(2).clear({ force: true, delay: 0 });
					cy.get('input').eq(2).type('70', { force: true, delay: 0 });
					cy.get('input').eq(3).clear({ force: true, delay: 0 });
					cy.get('input').eq(3).type('80', { force: true, delay: 0 });
				});

				getWPDataObject().then((data) => {
					const root = getButtonGlobalStyles(data);

					expect({
						type: 'custom',
						all: {
							width: '',
							style: '',
							color: '',
						},
						top: {
							width: '10px',
							color: '#ff4848',
							style: 'solid',
						},
						right: {
							width: '20px',
							color: '#ff4848',
							style: 'solid',
						},
						bottom: {
							width: '30px',
							color: '#ff4848',
							style: 'solid',
						},
						left: {
							width: '40px',
							color: '#ff4848',
							style: 'solid',
						},
					}).to.deep.equal(root?.blockeraBorder?.value);
					expect({
						type: 'custom',
						all: '',
						topLeft: '50px',
						topRight: '60px',
						bottomLeft: '70px',
						bottomRight: '80px',
					}).to.deep.equal(root?.blockeraBorderRadius?.value);
					expect({
						top: {
							color: '#ff4848',
							width: '10px',
							style: 'solid',
						},
						right: {
							color: '#ff4848',
							width: '20px',
							style: 'solid',
						},
						bottom: {
							color: '#ff4848',
							width: '30px',
							style: 'solid',
						},
						left: {
							color: '#ff4848',
							width: '40px',
							style: 'solid',
						},
						radius: {
							topLeft: '50px',
							topRight: '60px',
							bottomLeft: '70px',
							bottomRight: '80px',
						},
						color: undefined,
						width: undefined,
						style: undefined,
					}).to.deep.equal(root?.border);
				});

				cy.get('@border').within(() => {
					cy.get('input').eq(0).clear({ force: true, delay: 0 });
					cy.get('input').eq(1).clear({ force: true, delay: 0 });
					cy.get('input').eq(2).clear({ force: true, delay: 0 });
					cy.get('input').eq(3).clear({ force: true, delay: 0 });
				});

				[0, 1, 2, 3].forEach((index) => {
					cy.get('@border').within(() => {
						cy.getByDataTest('border-control-color')
							.eq(index)
							.click();
					});

					cy.get('.components-popover')
						.last()
						.within(() => {
							cy.getByAriaLabel('Reset Color (Clear)').click({
								force: true,
							});
						});
				});

				cy.get('@radius').within(() => {
					cy.get('input').eq(0).clear({ force: true, delay: 0 });
					cy.get('input').eq(1).clear({ force: true, delay: 0 });
					cy.get('input').eq(2).clear({ force: true, delay: 0 });
					cy.get('input').eq(3).clear({ force: true, delay: 0 });
				});

				getWPDataObject().then((data) => {
					const root = getButtonGlobalStyles(data);

					expect({
						type: 'custom',
						all: {
							width: '',
							style: '',
							color: '',
						},
						top: {
							width: '',
							color: '',
							style: '',
						},
						right: {
							width: '',
							color: '',
							style: '',
						},
						bottom: {
							width: '',
							color: '',
							style: '',
						},
						left: {
							width: '',
							color: '',
							style: '',
						},
					}).to.deep.equal(root?.blockeraBorder?.value);
					expect({
						all: '',
						topLeft: '',
						topRight: '',
						bottomLeft: '',
						bottomRight: '',
						type: 'custom',
					}).to.deep.equal(root?.blockeraBorderRadius?.value);
					expect(undefined).to.equal(root?.border);
				});
			});
		});
	});
});
