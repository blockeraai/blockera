/**
 * Blockera dependencies
 */
import {
	activateMuPlugin,
	deactivateMuPlugin,
	getEditedGlobalStylesSetting,
	openGlobalStylesColorPaletteScreen,
	savePage,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → color palette presets (theme.json + UI)', () => {
	const MU =
		'packages/global-styles-ui/js/test/fixtures/preset-theme-color-palette.php';
	const MU_NAME = 'blockera-test-gsui-preset-color-palette.php';

	beforeEach(() => {
		activateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	afterEach(() => {
		deactivateMuPlugin({ pluginPath: MU, pluginName: MU_NAME });
	});

	it('merges theme color.palette.theme from theme.json, shows in UI, persists color edit', () => {
		openGlobalStylesColorPaletteScreen();

		cy.get('.blockera-color-palette-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Ruby'
		);

		cy.contains(
			'.blockera-color-palette-presets [data-cy="color-repeater-item-header"]',
			'E2E Theme Ruby'
		).click({ force: true });

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataCy('color-btn').first().click({ force: true });
			});

		cy.get('.components-popover')
			.filter(':visible')
			.last()
			.within(() => {
				cy.getByDataCy('color-picker-css-value')
					.click({ force: true })
					.type('{selectall}#00ff99 ', { delay: 0 });
			});

		cy.realPress('Escape');
		cy.realPress('Escape');

		getEditedGlobalStylesSetting('color.palette.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-ruby');
			expect(String(row.color).toLowerCase()).to.match(
				/#00ff99|rgb\(0,\s*255,\s*153\)/
			);
		});

		savePage();

		cy.reload();

		openGlobalStylesColorPaletteScreen({ reset: false });

		cy.get('.blockera-color-palette-presets', { timeout: 20000 }).should(
			'contain',
			'E2E Theme Ruby'
		);

		getEditedGlobalStylesSetting('color.palette.theme').then((rows) => {
			const row = rows.find((r) => r.slug === 'e-2-e-theme-ruby');
			expect(String(row.color).toLowerCase()).to.match(
				/#00ff99|rgb\(0,\s*255,\s*153\)/
			);
		});
	});
});
