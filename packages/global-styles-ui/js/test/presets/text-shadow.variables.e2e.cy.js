/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesTextShadowsScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → text shadow presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-text-shadow.php';
	const MU_NAME = 'blockera-test-gsui-preset-text-shadow.php';

	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('merges theme textShadow.presets.theme from theme.json, shows in UI, persists blur edit', () => {
		openGlobalStylesTextShadowsScreen();

		cy.get('.blockera-text-shadows-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Text Shadow'
		);

		cy.contains(
			'.blockera-text-shadows-presets [data-cy="text-shadow-preset-repeater-item-header"]',
			'E2E Theme Text Shadow'
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
				cy.getByAriaLabel('Blur Effect').clear({ force: true });
				cy.getByAriaLabel('Blur Effect').type('8', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting(
			'blockera.blockeraTextShadow.presets.theme'
		).then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-tshadow');
			expect(row.shadow).to.match(/8px/);
		});

		savePage();

		cy.reload();

		openGlobalStylesTextShadowsScreen({ reset: false });

		cy.get('.blockera-text-shadows-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Text Shadow'
		);

		getEditedGlobalStylesSetting(
			'blockera.blockeraTextShadow.presets.theme'
		).then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-tshadow');
			expect(row.shadow).to.match(/8px/);
		});

		cy.contains(
			'.blockera-text-shadows-presets [data-cy="text-shadow-preset-repeater-item-header"]',
			'E2E Theme Text Shadow'
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
				cy.getByAriaLabel('Blur Effect').should(($el) => {
					expect(String($el.val())).to.match(/8/);
				});
			});
	});
});
