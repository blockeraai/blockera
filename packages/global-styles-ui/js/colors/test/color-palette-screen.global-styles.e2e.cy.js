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

	it('free tier: cannot add a second custom color; second add opens premium modal; add stays enabled', () => {
		openGlobalStylesColorPaletteScreen();

		cy.addNewGlobalStylesCustomColorPreset();

		const unique = `${Date.now()}`;
		cy.getByDataTest('global-styles-preset-name-field').within(() => {
			// eslint-disable-next-line cypress/unsafe-to-chain-command -- single input in preset name field
			cy.get('input')
				.first()
				.should('be.visible')
				.clear({ force: true })
				.type(`e2e free cap ${unique}`, { delay: 0, force: true });
		});

		cy.realPress('Escape');

		cy.getParentContainer('Custom Variables').within(() => {
			cy.getByDataCy('repeater-item', { timeout: 15000 }).should(
				'have.length',
				1
			);
		});

		cy.addNewGlobalStylesCustomColorPreset();

		cy.get('[role="dialog"]', { timeout: 15000 })
			.should('be.visible')
			.and('contain', 'Premium Feature')
			.within(() => {
				cy.contains('h3', 'Multiple Custom Variables').should(
					'be.visible'
				);
			});

		cy.realPress('Escape');

		cy.get('[role="dialog"]').should('not.exist');

		cy.getParentContainer('Custom Variables').within(() => {
			cy.getByDataCy('repeater-item').should('have.length', 1);
			cy.getByDataTest(
				'global-styles-preset-add-color-presets-custom'
			).should('not.be.disabled');
		});
	});
});
