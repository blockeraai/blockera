/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesShadowsScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → box shadow presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-shadow.php';
	const MU_NAME = 'blockera-test-gsui-preset-shadow.php';

	beforeEach(() => {
		activateMuPlugin(MU, MU_NAME);
	});

	afterEach(() => {
		deactivateMuPlugin(MU, MU_NAME);
	});

	it('merges theme shadow.presets.theme from theme.json, shows in UI, persists box-shadow edit', () => {
		openGlobalStylesShadowsScreen();

		cy.get('.blockera-shadows-editor', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Shadow'
		);

		cy.contains(
			'.blockera-shadows-editor [data-cy="shadow-preset-repeater-item-header"]',
			'E2E Theme Shadow'
		).click({ force: true });

		cy.get('.blockera-component-popover', { timeout: 15000 })
			.should('be.visible')
			.within(() => {
				cy.getByDataCy('group-control-header')
					.find('.blockera-control-repeater-group-header')
					.click({ force: true });
			});

		cy.get('.blockera-component-popover')
			.eq(1)
			.within(() => {
				cy.getByDataTest('box-shadow-x-input').clear({ force: true });
				cy.getByDataTest('box-shadow-x-input').type('22', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('shadow.presets.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-shadow');
			expect(row.shadow).to.match(/22px/);
		});

		savePage();

		cy.reload();

		openGlobalStylesShadowsScreen({ reset: false });

		cy.get('.blockera-shadows-editor', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Shadow'
		);

		getEditedGlobalStylesSetting('shadow.presets.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-shadow');
			expect(row.shadow).to.match(/22px/);
		});

		cy.contains(
			'.blockera-shadows-editor [data-cy="shadow-preset-repeater-item-header"]',
			'E2E Theme Shadow'
		).click({ force: true });

		cy.get('.blockera-component-popover', { timeout: 15000 })
			.should('be.visible')
			.within(() => {
				cy.getByDataCy('group-control-header')
					.find('.blockera-control-repeater-group-header')
					.click({ force: true });
			});

		cy.get('.blockera-component-popover')
			.eq(1)
			.within(() => {
				cy.getByDataTest('box-shadow-x-input').should(
					'have.value',
					'22'
				);
			});
	});
});
