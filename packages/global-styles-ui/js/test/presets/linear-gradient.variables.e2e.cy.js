/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesLinearGradientsScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → linear gradient presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-linear-gradient.php';
	const MU_NAME = 'blockera-test-gsui-preset-linear-gradient.php';

	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('merges theme color.gradients.theme from theme.json, shows in UI, persists name edit', () => {
		openGlobalStylesLinearGradientsScreen();

		cy.get('.blockera-linear-gradients-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Linear Theme'
		);

		cy.contains(
			'.blockera-linear-gradients-presets [data-cy="gradient-repeater-item-header"]',
			'E2E Linear Theme'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('global-styles-preset-name-field')
					.first()
					.clear({ force: true });
				cy.getByDataTest('global-styles-preset-name-field')
					.first()
					.type('E2E Linear Edited', { delay: 0, force: true });
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('color.gradients.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-lin-grad');
			expect(row.name).to.eq('E2E Linear Edited');
		});

		savePage();

		cy.reload();

		openGlobalStylesLinearGradientsScreen({ reset: false });

		cy.get('.blockera-linear-gradients-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Linear Edited'
		);

		getEditedGlobalStylesSetting('color.gradients.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-lin-grad');
			expect(row.name).to.eq('E2E Linear Edited');
		});

		cy.contains(
			'.blockera-linear-gradients-presets [data-cy="gradient-repeater-item-header"]',
			'E2E Linear Edited'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('global-styles-preset-name-field')
					.first()
					.should('have.value', 'E2E Linear Edited');
			});
	});
});
