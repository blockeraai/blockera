/**
 * Blockera dependencies
 */
import { openGlobalStylesColorPaletteScreen } from '@blockera/dev-cypress/js/helpers';

const CUSTOM_COLOR_GROUP =
	'.global-styles-ui-color-palette-panel .blockera-control-preset-group.color-presets-custom';

describe('Global Styles UI → Color variables screen', () => {
	it('opens the Blockera color palette screen using data-test hooks', () => {
		openGlobalStylesColorPaletteScreen();

		cy.get('.blockera-color-palette-presets', { timeout: 20000 }).should(
			'be.visible'
		);

		cy.get('.global-styles-ui-color-palette-panel').should('exist');
	});

	it('free tier: custom origin allows exactly one variable; add is then disabled', () => {
		openGlobalStylesColorPaletteScreen();

		cy.getByDataTest(
			'global-styles-preset-add-color-presets-custom'
		).should('not.be.disabled');

		cy.getByDataTest('global-styles-preset-add-color-presets-custom').click(
			{
				force: true,
			}
		);

		const unique = `${Date.now()}`;
		cy.getByDataTest('global-styles-preset-name-field')
			.find('input')
			.first()
			.should('be.visible')
			.clear({ force: true });

		cy.getByDataTest('global-styles-preset-name-field')
			.find('input')
			.first()
			.type(`e2e free cap ${unique}`, { delay: 0, force: true });

		cy.realPress('Escape');

		cy.get(`${CUSTOM_COLOR_GROUP} [data-cy="repeater-item"]`, {
			timeout: 15000,
		}).should('have.length', 1);

		cy.getByDataTest(
			'global-styles-preset-add-color-presets-custom'
		).should('be.disabled');
	});
});
