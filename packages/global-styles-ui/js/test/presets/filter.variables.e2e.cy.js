/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesFiltersScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → filter presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-filter.php';
	const MU_NAME = 'blockera-test-gsui-preset-filter.php';

	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('merges theme filter.presets.theme from theme.json, shows in UI, persists blur edit', () => {
		openGlobalStylesFiltersScreen();

		cy.get('.blockera-filters-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Filter'
		);

		cy.contains(
			'.blockera-filters-presets [data-cy="filter-preset-repeater-item-header"]',
			'E2E Theme Filter'
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
				cy.getByDataTest('filter-blur-input').clear({ force: true });
				cy.getByDataTest('filter-blur-input').type('7', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('filter.presets.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-filter');
			expect(row.items[0].blur).to.eq('7px');
		});

		savePage();

		cy.reload();

		openGlobalStylesFiltersScreen({ reset: false });

		cy.get('.blockera-filters-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Filter'
		);

		getEditedGlobalStylesSetting('filter.presets.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-filter');
			expect(row.items[0].blur).to.eq('7px');
		});

		cy.contains(
			'.blockera-filters-presets [data-cy="filter-preset-repeater-item-header"]',
			'E2E Theme Filter'
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
				cy.getByDataTest('filter-blur-input').should('have.value', '7');
			});
	});
});
