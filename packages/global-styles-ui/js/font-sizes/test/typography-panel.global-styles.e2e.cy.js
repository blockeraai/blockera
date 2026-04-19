/**
 * External dependencies
 */
import {
	openGlobalStylesTypographyFlow,
	TYPOGRAPHY_OVERRIDE_CLASS,
} from '@blockera/dev-cypress/js/helpers';

describe('Global Styles → Typography panel (DOM + observer)', () => {
	it('adds typography override class and mounts font sizes entry after typography handler runs', () => {
		openGlobalStylesTypographyFlow();

		cy.get('button[id="/typography"]').should('exist');

		cy.get('.blockera-font-size-presets-count').should('have.length', 1);
	});

	it('does not mount duplicate font size preset rows while the list screen is present', () => {
		openGlobalStylesTypographyFlow();

		cy.get('.blockera-font-size-presets-count').should('have.length', 1);

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(400);

		cy.get('.blockera-font-size-presets-count').should('have.length', 1);
	});

	it('navigates to Font size variables and applies count-active DOM + hides previous sibling', () => {
		openGlobalStylesTypographyFlow();

		cy.get('.blockera-font-size-presets-count-active').should('not.exist');

		cy.contains(
			'.blockera-font-size-presets-count button',
			'Font size variables'
		)
			.should('exist')
			.click({ force: true });

		cy.get('.blockera-font-size-presets-count-active').should('exist');

		cy.get('.blockera-font-size-presets-count-active')
			.prev()
			.should(($el) => {
				expect($el.css('display')).to.eq('none');
			});
	});

	it('navigates to heading element screen - applies count-active DOM + hides previous sibling', () => {
		openGlobalStylesTypographyFlow();

		cy.get('.blockera-font-size-presets-count-active').should('not.exist');

		cy.get('button[id="/typography/heading"]').click({ force: true });
		cy.get('button[data-wp-component="Navigator.BackButton"]')
			.first()
			.click({ force: true });

		cy.get('.blockera-font-size-presets-count').should('exist');
	});

	it('ScreenHeader back runs onBackFontSizes (clears count-active, returns to list)', () => {
		openGlobalStylesTypographyFlow();

		cy.get('.blockera-font-size-presets-count-active').should('not.exist');

		cy.contains(
			'.blockera-font-size-presets-count button',
			'Font size variables'
		)
			.should('exist')
			.click({ force: true });

		cy.get('.blockera-font-size-presets-count-active').should('exist');

		cy.get('.blockera-font-size-presets-count-active')
			.find('button[data-wp-component="Navigator.BackButton"]')
			.first()
			.click({ force: true });

		cy.get('.blockera-font-size-presets-count-active').should('not.exist');

		cy.contains(
			'.blockera-font-size-presets-count',
			'Font size variables'
		).should('exist');
	});

	it('removes typography override class when the useOverrideNavigator target back button is clicked', () => {
		openGlobalStylesTypographyFlow();

		cy.window().then((win) => {
			const btn = win.document.querySelector(
				'button[data-wp-component="Navigator.BackButton"]:first-child'
			);
			expect(
				btn,
				'matches useOverrideNavigator querySelector target'
			).to.be.instanceOf(win.HTMLButtonElement);
			btn.click();
		});

		cy.get('body').should('not.have.class', TYPOGRAPHY_OVERRIDE_CLASS);
	});
});
