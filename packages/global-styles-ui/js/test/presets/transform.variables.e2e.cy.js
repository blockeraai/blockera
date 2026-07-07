/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesTransformsScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → transform presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-transform.php';
	const MU_NAME = 'blockera-test-gsui-preset-transform.php';

	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('merges theme transform.presets.theme from theme.json, shows in UI, persists move-x edit', () => {
		openGlobalStylesTransformsScreen();

		cy.get('.blockera-transforms-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Transform'
		);

		cy.contains(
			'.blockera-transforms-presets [data-cy="transform-preset-repeater-item-header"]',
			'E2E Theme Transform'
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
				cy.getByAriaLabel('Move-X').clear({ force: true });
				cy.getByAriaLabel('Move-X').type('12', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('transform.presets.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-transform');
			expect(row.items[0]['move-x']).to.eq('12px');
		});

		savePage();

		cy.reload();

		openGlobalStylesTransformsScreen({ reset: false });

		cy.get('.blockera-transforms-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Transform'
		);

		getEditedGlobalStylesSetting('transform.presets.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-transform');
			expect(row.items[0]['move-x']).to.eq('12px');
		});

		cy.contains(
			'.blockera-transforms-presets [data-cy="transform-preset-repeater-item-header"]',
			'E2E Theme Transform'
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
				cy.getByAriaLabel('Move-X').should('have.value', '12');
			});
	});
});
