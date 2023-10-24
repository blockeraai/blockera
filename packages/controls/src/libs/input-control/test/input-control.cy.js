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
			cy.withDataProvider({
				component: <InputControl defaultValue={20} />,
			});
			cy.get('input').should('have.value', 20);
		});
		it('should display onchanged value - number', () => {
			cy.withDataProvider({
				component: <InputControl />,
			});
			cy.get('input').type(100).should('have.value', 100);
		});
		it('should display onchanged value - string', () => {
			cy.withDataProvider({
				component: <InputControl />,
			});
			cy.get('input')
				.type('this is a test value')
				.should('have.value', 'this is a test value');
		});
		it('should render clear input', () => {
			cy.withDataProvider({
				component: <InputControl />,
			});
			cy.get('input')
				.type('this is a text')
				.clear()
				.should('have.value', '');
		});
		it('should control data value must be equal with expected data value passed in data provider access with control identifier', () => {
			cy.withDataProvider({
				component: (
					<InputControl defaultValue={'10px'} id={'inputControl'} />
				),
				value: {
					inputControl: '300px',
				},
			});
			cy.get('input').should('have.value', '300px');
		});
		it('should control data value must be equal with expected data value passed in data provider access with control identifier', () => {
			cy.withDataProvider({
				component: (
					<InputControl
						defaultValue={'10px'}
						id={'inputControl.value'}
					/>
				),
				value: {
					inputControl: {
						value: '300px',
					},
				},
			});
			cy.get('input').should('have.value', '300px');
		});
		it('should render label prop value', () => {
			cy.withDataProvider({
				component: <InputControl label="Example Label" />,
			});
			cy.get('[aria-label="Example Label"]').should(
				'contain',
				'Example Label'
			);
		});
	});

	describe('text input', () => {
		it('should display onchanged string value', () => {
			cy.withDataProvider({
				component: <InputControl />,
			});
			cy.get('input')
				.type('this is a test value')
				.should('have.value', 'this is a test value');
		});
	});

	describe('number input', () => {
		it('should display onchanged number value', () => {
			cy.withDataProvider({
				component: <InputControl type="number" />,
			});
			cy.get('input').type(100).should('have.value', 100);
		});
		it('should render incrementing-and-decrementing by arrows', () => {
			cy.withDataProvider({
				component: <InputControl type="number" />,
			});
			cy.get('input[type="number"]').type(100).trigger('change');
			cy.get('input[type="number"]').should('have.value', 100);
			cy.get('input[type="number"]').clear();
			cy.get('input[type="number"]').type(-100).trigger('change');
			cy.get('input[type="number"]').should('have.value', -100);
		});
		it('should skip string value', () => {
			cy.withDataProvider({
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

			cy.withDataProvider({
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
			cy.withDataProvider({
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
			cy.withDataProvider({
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
			cy.withDataProvider({
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
			cy.withDataProvider({
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
