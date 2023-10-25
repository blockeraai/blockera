/// <reference types="Cypress" />

import GradientBarControl from '../';
describe('gradient bar control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});
	it('should display label', () => {
		cy.withDataProvider({
			component: <GradientBarControl label="My Label" />,
			value: [],
		});
		cy.get('[aria-label="My Label"]').should('contain', 'My Label');
	});
	it('should display to pointer in initial state', () => {
		cy.withDataProvider({
			component: <GradientBarControl label="My Label" />,
			value: [],
		});
		cy.getByDataCy('gradient-bar-control')
			.find('button')
			.should('have.length', 2);
	});
	it('should add new gradient', () => {
		cy.withDataProvider({
			component: <GradientBarControl label="My Label" />,
			value: [],
		});
		cy.getByDataCy('gradient-bar-control').click();
		cy.get('[aria-label="Color"]').click();
		cy.get('.components-popover').clickOutside();
		cy.getByDataCy('gradient-bar-control')
			.find('button')
			.should('have.length', 3);
	});
	it.only('should drag color pointers', () => {
		cy.withDataProvider({
			component: <GradientBarControl label="My Label" />,
			value: [],
		});
		// cy.get('button').first().realMouseMove(50, 0);
		cy.get('button')
			.first()
			.trigger('mousemove', { pageX: 100, pageY: 100, which: 1 });
	});
});
