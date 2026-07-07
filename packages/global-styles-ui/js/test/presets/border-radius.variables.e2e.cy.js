/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesBorderRadiusScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → border radius presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-border-radius.php';
	const MU_NAME = 'blockera-test-gsui-preset-border-radius.php';

	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('merges theme radiusSizes.theme from theme.json, shows in UI, persists edits', () => {
		openGlobalStylesBorderRadiusScreen();

		cy.get('.blockera-border-radius-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Radius'
		);

		cy.contains(
			'.blockera-border-radius-presets [data-cy="border-radius-preset-repeater-item-header"]',
			'E2E Theme Radius'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('border-radius-size-input').clear({
					force: true,
				});
				cy.getByDataTest('border-radius-size-input').type('18px', {
					delay: 0,
					force: true,
				});
			});

		cy.realPress('Escape');

		getEditedGlobalStylesSetting('border.radiusSizes.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-radius');
				expect(row.size).to.eq('18px');
			}
		);

		savePage();

		cy.reload();

		openGlobalStylesBorderRadiusScreen({ reset: false });

		cy.get('.blockera-border-radius-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Radius'
		);

		getEditedGlobalStylesSetting('border.radiusSizes.theme').then(
			(rows) => {
				const row = rows.find((r) => r.slug === 'e-2-e-theme-radius');
				expect(row.size).to.eq('18px');
			}
		);

		cy.contains(
			'.blockera-border-radius-presets [data-cy="border-radius-preset-repeater-item-header"]',
			'E2E Theme Radius'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataTest('border-radius-size-input').should(
					'have.value',
					'18'
				);
			});
	});
});
