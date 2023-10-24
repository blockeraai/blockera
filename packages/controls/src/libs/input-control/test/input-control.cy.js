/// <reference types="Cypress" />

import { InputControl } from '../input';

describe('input control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});
	describe('default', () => {
		it('should display default value', () => {
			cy.withInspector({
				component: <InputControl defaultValue={20} />,
			});
			cy.get('input').should('have.value', 20);
		});
		it('should display onchanged value - number', () => {
			cy.withInspector({
				component: <InputControl />,
			});
			cy.get('input').type(100).should('have.value', 100);
		});
		it('should display onchanged value - string', () => {
			cy.withInspector({
				component: <InputControl />,
			});
			cy.get('input')
				.type('this is a test value')
				.should('have.value', 'this is a test value');
		});
		it('should render clear input', () => {
			cy.withInspector({
				component: <InputControl />,
			});
			cy.get('input')
				.type('this is a text')
				.clear()
				.should('have.value', '');
		});
	});

	describe('text input', () => {
		it('should display onchanged string value', () => {
			cy.withInspector({
				component: <InputControl />,
			});
			cy.get('input')
				.type('this is a test value')
				.should('have.value', 'this is a test value');
		});
	});

	describe('number input', () => {
		it('should display onchanged number value', () => {
			cy.withInspector({
				component: <InputControl type="number" />,
			});
			cy.get('input').type(100).should('have.value', 100);
		});
		it('should render incrementing-and-decrementing by arrows', () => {
			cy.withInspector({
				component: <InputControl type="number" />,
			});
			cy.get('input[type="number"]').type(100).trigger('change');
			cy.get('input[type="number"]').should('have.value', 100);
			cy.get('input[type="number"]').clear();
			cy.get('input[type="number"]').type(-100).trigger('change');
			cy.get('input[type="number"]').should('have.value', -100);
		});
		it('should skip string value', () => {
			cy.withInspector({
				component: <InputControl type="number" />,
			});
			cy.get('input')
				.type('this is a test value')
				.should('not.have.value', 'this is a test value');
		});
	});

	describe('unit input', () => {
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
	});

	describe('range unit', () => {
		it('should change value by range control ', () => {
			cy.withInspector({
				component: <InputControl range />,
			});
			cy.get('input[type=range]').invoke('val', '70').trigger('change');
			cy.get('input').should('have.value', '70');
		});
		it('should render range unit input', () => {
			const units = [
				{ value: 'px', label: 'px', default: 0 },
				{ value: '%', label: '%', default: 10 },
				{ value: 'em', label: 'em', default: 0 },
			];
			cy.withInspector({
				component: <InputControl range units={units} />,
			});
			cy.get('input[type=range]').invoke('val', '70').trigger('change');
			cy.get('input').should('have.value', '70');
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
	});

	describe('css unit', () => {
		it('should render css units', () => {
			cy.withInspector({
				component: <InputControl range unitType="general" />,
			});
			cy.get('[aria-label="Select unit"]')
				.select('px')
				.should('have.value', 'px');
			cy.get('input[type=range]').should('exist');
			cy.get('input[type=range]').invoke('val', '70').trigger('change');
			cy.get('input').should('have.value', '70');

			cy.get('[aria-label="Select unit"]')
				.select('auto')
				.should('have.value', 'auto');
			cy.get('input[type=range]').should('not.be.visible');
			cy.get('[aria-label="Select unit"]')
				.select('inherit')
				.should('have.value', 'inherit');
			cy.get('input[type=range]').should('not.be.visible');
			cy.get('[aria-label="Select unit"]')
				.select('initial')
				.should('have.value', 'initial');
			cy.get('input[type=range]').should('not.be.visible');
		});
	});
});
