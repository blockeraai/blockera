/// <reference types="Cypress" />

import ToggleControl from '..';

describe('toggle control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});
	it('should display not toggled in initial state', () => {
		cy.withDataProvider({
			component: <ToggleControl />,
		});
		cy.get('.components-form-toggle').should(
			'not.have.class',
			'is-checked'
		);
		cy.get('input[type="checkbox"]').should('exist');
	});
	it('should display label', () => {
		cy.withDataProvider({
			component: <ToggleControl label="my toggle" />,
		});
		cy.get('input[type="checkbox"]').should('exist');
		cy.get('label').should('contain', 'my toggle');
	});
	it('should render toggle select', () => {
		cy.withDataProvider({
			component: <ToggleControl label="my toggle" />,
		});
		cy.get('.components-form-toggle').click();
		cy.get('.components-form-toggle').should('have.class', 'is-checked');
		cy.get('input[type="checkbox"]').should('exist');
	});
	it('should render custom classname', () => {
		cy.withDataProvider({
			component: (
				<ToggleControl label="my toggle" className="custom-class" />
			),
		});
		cy.get('.components-toggle-control').should(
			'have.class',
			'custom-class'
		);
		cy.get('input[type="checkbox"]').should('exist');
	});
	it('should render default value', () => {
		cy.withDataProvider({
			component: <ToggleControl value={true} label="my toggle" />,
		});
		cy.get('.components-form-toggle').should('have.class', 'is-checked');
	});
});
