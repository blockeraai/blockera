/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesBordersScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → border box presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-border.php';
	const MU_NAME = 'blockera-test-gsui-preset-border.php';

	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('merges theme border.presets.theme from theme.json, shows in UI, persists width edit', () => {
		openGlobalStylesBordersScreen();

		cy.get('.blockera-borders-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Border'
		);

		cy.contains(
			'.blockera-borders-presets [data-cy="border-preset-repeater-item-header"]',
			'E2E Theme Border'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('border-control-width').clear({ force: true });
				cy.getByDataTest('border-control-width').type('6', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('blockeraBorder.presets.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-border');
				expect(row.border.width).to.eq('6px');
			}
		);

		savePage();

		cy.reload();

		openGlobalStylesBordersScreen({ reset: false });

		cy.get('.blockera-borders-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Border'
		);

		getEditedGlobalStylesSetting('blockeraBorder.presets.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-border');
				expect(row.border.width).to.eq('6px');
			}
		);

		cy.contains(
			'.blockera-borders-presets [data-cy="border-preset-repeater-item-header"]',
			'E2E Theme Border'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('border-control-width').should(
					'have.value',
					'6'
				);
			});
	});
});
