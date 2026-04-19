/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesSpacingScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → spacing presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-spacing.php';
	const MU_NAME = 'blockera-test-gsui-preset-spacing.php';

	beforeEach(() => {
		activateMuPlugin(MU, MU_NAME);
	});

	afterEach(() => {
		deactivateMuPlugin(MU, MU_NAME);
	});

	it('merges theme spacingSizes.theme from theme.json, shows in UI, persists edits to user settings', () => {
		openGlobalStylesSpacingScreen();

		cy.get('.blockera-spacing-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Space'
		);

		cy.contains(
			'.blockera-spacing-presets [data-cy="spacing-size-repeater-item-header"]',
			'E2E Theme Space'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('spacing-size-input').clear({ force: true });
				cy.getByDataTest('spacing-size-input').type('24px', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('spacing.spacingSizes.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-space');
				expect(row.size).to.eq('24px');
			}
		);

		savePage();

		cy.reload();

		openGlobalStylesSpacingScreen({ reset: false });

		cy.get('.blockera-spacing-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Space'
		);

		getEditedGlobalStylesSetting('spacing.spacingSizes.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-space');
				expect(row.size).to.eq('24px');
			}
		);

		cy.contains(
			'.blockera-spacing-presets [data-cy="spacing-size-repeater-item-header"]',
			'E2E Theme Space'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('spacing-size-input').should(
					'have.value',
					'24px'
				);
			});
	});
});
