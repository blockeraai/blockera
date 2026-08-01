/**
 * Blockera dependencies
 */
import { openGlobalStylesColorPaletteScreen } from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → Color variables screen', () => {
	it('opens the Blockera color palette screen using data-test hooks', () => {
		openGlobalStylesColorPaletteScreen();

		cy.get('.blockera-color-palette-presets', { timeout: 20000 }).should(
			'be.visible'
		);

		cy.get('.global-styles-ui-color-palette-panel').should('exist');
	});
});
