/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesFontSizesVariablesScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → font size presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-font-size.php';
	const MU_NAME = 'blockera-test-gsui-preset-font-size.php';

	beforeEach(() => {
		activateMuPlugin(MU, MU_NAME);
	});

	afterEach(() => {
		deactivateMuPlugin(MU, MU_NAME);
	});

	it('merges theme typography.fontSizes.theme from theme.json, shows in UI, persists size edit', () => {
		openGlobalStylesFontSizesVariablesScreen();

		cy.get('.blockera-font-size-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Font Size'
		);
		cy.contains(
			'.blockera-font-size-presets [data-cy="font-size-repeater-item-header"]',
			'E2E Theme Font Size'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.get('input[type="text"]').eq(2).clear({ force: true });
				cy.get('input[type="text"]').eq(2).type('26', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('typography.fontSizes.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-fs');
				expect(row.size).to.eq('26px');
			}
		);

		savePage();

		cy.reload();

		openGlobalStylesFontSizesVariablesScreen({ reset: false });

		cy.get('.blockera-font-size-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Font Size'
		);

		getEditedGlobalStylesSetting('typography.fontSizes.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-fs');
				expect(row.size).to.eq('26px');
			}
		);

		cy.contains(
			'.blockera-font-size-presets [data-cy="font-size-repeater-item-header"]',
			'E2E Theme Font Size'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.get('input[type="text"]').eq(2).should('have.value', '26');
			});
	});
});
