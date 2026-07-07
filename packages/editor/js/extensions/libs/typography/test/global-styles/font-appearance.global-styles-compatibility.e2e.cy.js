/**
 * Font Appearance → WP Compatibility (Global Styles)
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
	'Simple Value (Weight and Style)': {
		path: `${FIXTURE_ROOT}/font-appearance-setup-1.php`,
		target: 'blockera-test-font-appearance-global-styles-weight-style.php',
	},
	'Weight Only': {
		path: `${FIXTURE_ROOT}/font-appearance-setup-2.php`,
		target: 'blockera-test-font-appearance-global-styles-weight.php',
	},
	'Style Only': {
		path: `${FIXTURE_ROOT}/font-appearance-setup-3.php`,
		target: 'blockera-test-font-appearance-global-styles-style.php',
	},
};

const activeMuPlugins = new Map();

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

describe('Font Appearance → WP Compatibility (Global Styles)', () => {
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
		describe('Simple Value (Weight and Style)', () => {
			it('Simple Value (Weight and Style)', () => {
				cy.getParentContainer('Appearance').as('container');

				getWPDataObject().then((data) => {
					expect({
						weight: '600',
						style: 'italic',
					}).to.deep.equal(
						getParagraphGlobalStyles(data)?.blockeraFontAppearance
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('select').select('200-normal');
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect('200').to.equal(root?.typography?.fontWeight);
					expect('normal').to.equal(root?.typography?.fontStyle);
				});

				cy.get('@container').within(() => {
					cy.get('select').select('', { force: true });
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect(undefined).to.equal(root?.typography?.fontWeight);
					expect(undefined).to.equal(root?.typography?.fontStyle);
					expect(undefined).to.equal(
						root?.blockeraFontAppearance?.value
					);
				});
			});
		});

		describe('Weight Only', () => {
			it('Weight Only', () => {
				cy.getParentContainer('Appearance').as('container');

				getWPDataObject().then((data) => {
					expect({
						weight: '700',
						style: 'normal',
					}).to.deep.equal(
						getParagraphGlobalStyles(data)?.blockeraFontAppearance
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('select').select('400-normal');
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect('400').to.equal(root?.typography?.fontWeight);
					expect('normal').to.equal(root?.typography?.fontStyle);
				});
			});
		});

		describe('Style Only', () => {
			it('Style Only', () => {
				cy.getParentContainer('Appearance').as('container');

				getWPDataObject().then((data) => {
					expect({
						weight: '100',
						style: 'italic',
					}).to.deep.equal(
						getParagraphGlobalStyles(data)?.blockeraFontAppearance
							?.value
					);
				});

				cy.get('@container').within(() => {
					cy.get('select').select('300-normal');
				});

				getWPDataObject().then((data) => {
					const root = getParagraphGlobalStyles(data);
					expect('300').to.equal(root?.typography?.fontWeight);
					expect('normal').to.equal(root?.typography?.fontStyle);
				});
			});
		});
	});
});
