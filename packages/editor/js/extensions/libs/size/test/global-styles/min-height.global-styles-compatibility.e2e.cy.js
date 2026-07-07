/**
 * Min Height → WP Compatibility (Global Styles)
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
	'packages/editor/js/extensions/libs/size/test/global-styles/fixtures';

const muPluginByTestTitle = {
	'Simple Value': {
		path: `${FIXTURE_ROOT}/min-height-setup-1.php`,
		target: 'blockera-test-min-height-global-styles-cover.php',
		block: 'cover',
	},
	'Group Simple Value': {
		path: `${FIXTURE_ROOT}/min-height-setup-group-1.php`,
		target: 'blockera-test-min-height-global-styles-group.php',
		block: 'group',
	},
};

const activeMuPlugins = new Map();

const getCoverGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/cover'];

const getGroupGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/group'];

const openBlockGlobalStyles = (block) => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
	cy.get(`button[id="/blocks/core%2F${block}"]`).click();
	cy.getByDataTest('style-default').click();
	cy.addNewTransition();
};

describe('Min Height → WP Compatibility (Global Styles)', () => {
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

		if (muPlugin?.block === 'group') {
			openBlockGlobalStyles('group');
		} else {
			openBlockGlobalStyles('cover');
		}
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

	describe('Cover Block', () => {
		describe('Simple Value', () => {
			it('Simple Value', () => {
				cy.getParentContainer('Min Height').as('minHeightContainer');

				getWPDataObject().then((data) => {
					expect('300px').to.equal(
						getCoverGlobalStyles(data)?.blockeraMinHeight?.value
					);
				});

				cy.get('@minHeightContainer').within(() => {
					cy.get('input').clear({ force: true });
				});

				// Re-activate min height
				cy.activateMoreSettingsItem('More Size Settings', 'Min Height');

				cy.get('@minHeightContainer').within(() => {
					cy.get('input').type('400px', { force: true });
				});

				getWPDataObject().then((data) => {
					expect('400px').to.equal(
						getCoverGlobalStyles(data)?.dimensions?.minHeight
					);
				});

				cy.get('@minHeightContainer').within(() => {
					cy.get('input').clear({ force: true });
				});

				getWPDataObject().then((data) => {
					const root = getCoverGlobalStyles(data);
					const dimensionsMinHeight = root?.dimensions?.minHeight;
					const blockeraMinHeight = root?.blockeraMinHeight?.value;

					expect('400px').to.not.equal(dimensionsMinHeight);
					expect(['300px', undefined]).to.include(
						dimensionsMinHeight
					);
					expect(['300px', undefined]).to.include(blockeraMinHeight);
				});
			});
		});
	});

	describe('Group Block', () => {
		describe('Group Simple Value', () => {
			it('Group Simple Value', () => {
				cy.getParentContainer('Min Height').as('minHeightContainer');

				getWPDataObject().then((data) => {
					expect('300px').to.equal(
						getGroupGlobalStyles(data)?.blockeraMinHeight?.value
					);
				});

				cy.get('@minHeightContainer').within(() => {
					cy.get('input').clear({ force: true });
				});

				// Re-activate min height
				cy.activateMoreSettingsItem('More Size Settings', 'Min Height');

				cy.getParentContainer('Min Height').within(() => {
					cy.get('input').type('400px', { force: true });
				});

				getWPDataObject().then((data) => {
					expect('400px').to.equal(
						getGroupGlobalStyles(data)?.dimensions?.minHeight
					);
				});

				cy.get('@minHeightContainer').within(() => {
					cy.get('input').clear({ force: true });
				});

				getWPDataObject().then((data) => {
					const root = getGroupGlobalStyles(data);
					const dimensionsMinHeight = root?.dimensions?.minHeight;
					const blockeraMinHeight = root?.blockeraMinHeight?.value;

					expect('400px').to.not.equal(dimensionsMinHeight);
					expect(['300px', undefined]).to.include(
						dimensionsMinHeight
					);
					expect(['300px', undefined]).to.include(blockeraMinHeight);
				});
			});
		});
	});
});
