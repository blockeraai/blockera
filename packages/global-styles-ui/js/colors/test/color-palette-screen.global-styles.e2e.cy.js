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

		cy.getParentContainer('Custom variables').within(() => {
			cy.get('[data-cy="repeater-item"]', { timeout: 15000 })
				.last()
				.should('be.visible');
		});

		const unique = `${Date.now()}`;
		// eslint-disable-next-line cypress/unsafe-to-chain-command -- data-test is on the input itself
		cy.getByDataTest('global-styles-preset-name-field')
			.first()
			.should('be.visible');
		cy.getByDataTest('global-styles-preset-name-field')
			.first()
			.clear({ force: true });
		cy.getByDataTest('global-styles-preset-name-field')
			.first()
			.type(`e2e free cap ${unique}`, { delay: 0, force: true });

		cy.realPress('Escape');

		cy.getParentContainer('Custom variables').within(() => {
			cy.getByDataCy('repeater-item', { timeout: 15000 }).should(
				'have.length',
				1
			);
		});

		cy.addNewGlobalStylesCustomColorPreset();

		cy.get('.blockera-component-upgrade-prompt', { timeout: 15000 })
			.should('be.visible')
			.and('contain.text', 'Unlimited Custom Color Variables')
			.and('contain.text', 'Free: 1 variable');

		cy.realPress('Escape');

		cy.get('.blockera-component-upgrade-prompt').should('not.exist');

		cy.getParentContainer('Custom variables').within(() => {
			cy.getByDataCy('repeater-item').should('have.length', 1);
			cy.getByDataTest(
				'global-styles-preset-add-color-presets-custom'
			).should('not.be.disabled');
		});
	});
});
