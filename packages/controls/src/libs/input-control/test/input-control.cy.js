/// <reference types="Cypress" />

import { InputControl } from '../input';

describe('input control component testing', () => {
	it('should change value of number input in defualt mode!', () => {
		cy.withInspector({
			component: <InputControl />,
		});
		cy.get('input').type(10).should('have.value', 10);
	});
	it('should change value of string input', () => {
		cy.withInspector({
			component: <InputControl />,
		});
		cy.get('input').type('10px').should('have.value', '10px');
	});
	it('should change and handle units dropdown ', () => {
		const units = [
			{ value: 'px', label: 'px', default: 0 },
			{ value: '%', label: '%', default: 10 },
			{ value: 'em', label: 'em', default: 0 },
		];

		cy.withInspector({
			component: <InputControl units={units} />,
		});
		cy.get('[aria-label="Select unit"]')
			.select('px')
			.should('have.value', 'px');
		cy.get('[aria-label="Select unit"]')
			.select('%')
			.should('have.value', '%');
		cy.get('[aria-label="Select unit"]')
			.select('em')
			.should('have.value', 'em');
	});
	it('should change and handle units dropdown with unit type', () => {
		cy.withInspector({
			component: <InputControl unitType="background-position" />,
		});
		cy.get('[aria-label="Select unit"]')
			.select('%')
			.should('have.value', '%');
		cy.get('[aria-label="Select unit"]')
			.select('px')
			.should('have.value', 'px');
		cy.get('[aria-label="Select unit"]')
			.select('vw')
			.should('have.value', 'vw');
		cy.get('[aria-label="Select unit"]')
			.select('vh')
			.should('have.value', 'vh');
		cy.get('[aria-label="Select unit"]')
			.select('dvw')
			.should('have.value', 'dvw');
		cy.get('[aria-label="Select unit"]')
			.select('dvh')
			.should('have.value', 'dvh');
	});
	it('should change value by range control ', () => {
		cy.withInspector({
			component: <InputControl range />,
		});
		cy.get('input[type=range]').invoke('val', '70').trigger('change');
		cy.get('input').should('have.value', '70');
	});
});
