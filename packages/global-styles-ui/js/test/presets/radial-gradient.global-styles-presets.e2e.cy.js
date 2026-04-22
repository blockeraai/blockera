/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesRadialGradientsScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → radial gradient presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-radial-gradient.php';
	const MU_NAME = 'blockera-test-gsui-preset-radial-gradient.php';

	beforeEach(() => {
		activateMuPlugin(MU, MU_NAME);
	});

	afterEach(() => {
		deactivateMuPlugin(MU, MU_NAME);
	});

	it('merges theme color.gradients.theme from theme.json, shows in UI, persists name edit', () => {
		openGlobalStylesRadialGradientsScreen();

		cy.get('.blockera-radial-gradients-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Radial Theme'
		);

		cy.contains(
			'.blockera-radial-gradients-presets [data-cy="gradient-repeater-item-header"]',
			'E2E Radial Theme'
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
					.type('E2E Radial Edited', { delay: 0, force: true });
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('color.gradients.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-rad-grad');
			expect(row.name).to.eq('E2E Radial Edited');
		});

		savePage();

		cy.reload();

		openGlobalStylesRadialGradientsScreen({ reset: false });

		cy.get('.blockera-radial-gradients-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Radial Edited'
		);

		getEditedGlobalStylesSetting('color.gradients.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-rad-grad');
			expect(row.name).to.eq('E2E Radial Edited');
		});

		cy.contains(
			'.blockera-radial-gradients-presets [data-cy="gradient-repeater-item-header"]',
			'E2E Radial Edited'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('global-styles-preset-name-field')
					.first()
					.should('have.value', 'E2E Radial Edited');
			});
	});
});
