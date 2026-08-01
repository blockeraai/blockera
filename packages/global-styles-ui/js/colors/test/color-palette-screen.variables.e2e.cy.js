/**
 * Blockera dependencies
 */
import {
	openGlobalStylesColorPaletteScreen,
	assertCompanionInstallModalVisible,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles UI → Color variables screen', () => {
	it('opens the Blockera color palette screen using data-test hooks', () => {
		openGlobalStylesColorPaletteScreen();

		cy.get('.blockera-color-palette-presets', { timeout: 20000 }).should(
			'be.visible'
		);

		cy.get('.global-styles-ui-color-palette-panel').should('exist');
	});

	it('theme mode: add custom color opens companion gate; no preset is created', () => {
		openGlobalStylesColorPaletteScreen();

		cy.getParentContainer('Custom variables').within(() => {
			cy.getByDataCy('repeater-item').should('have.length', 0);
		});

		cy.addNewGlobalStylesCustomColorPreset();

		assertCompanionInstallModalVisible();

		cy.realPress('Escape');

		cy.getByDataTest('feature-wrapper-companion-modal').should('not.exist');

		cy.getParentContainer('Custom variables').within(() => {
			cy.getByDataCy('repeater-item').should('have.length', 0);
			cy.getByDataTest(
				'global-styles-preset-add-color-presets-custom'
			).should('not.be.disabled');
		});
	});
});
