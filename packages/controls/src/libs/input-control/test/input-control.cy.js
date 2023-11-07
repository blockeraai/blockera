/// <reference types="Cypress" />

import { getControlValue } from '../../../store/selectors';
import { InputControl } from '../input';
import { nanoid } from 'nanoid';

describe('input control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});
	describe('default', () => {
		it('should display default value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl defaultValue={20} />,
				name,
				value: 20,
			});
			cy.get('input').should('have.value', 20);

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq(20);
			});
		});
		it('should display onchanged value - number', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl />,
				name,
			});
			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('input').type(100).should('have.value', 100);

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100');
			});
		});
		it('should display onchanged value - string', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl />,
				name,
			});
			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('input')
				.type('this is a test value')
				.should('have.value', 'this is a test value');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('this is a test value');
			});
		});
		it('should render clear input', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl />,
				name,
			});
			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('input')
				.type('this is a text')
				.clear()
				.should('have.value', '');

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.eq('');
			});
		});
		it('should control data value must be equal with expected data value passed in data provider access with control identifier', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<InputControl defaultValue={'10px'} id={'inputControl'} />
				),
				value: {
					inputControl: '300px',
				},
				name,
			});
			cy.get('input').should('have.value', '300px');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name).inputControl).to.eq('300px');
			});
		});
		it('should control data value equal with expected defaultValue when id of context value was not defined', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<InputControl
						defaultValue={'10px'}
						id={'inputControl.value'}
					/>
				),
				value: {
					inputControl: {
						value: undefined,
					},
				},
				name,
			});
			cy.get('input').should('have.value', '10px');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name).inputControl.value).to.eq(
					undefined
				);
			});
		});
		it('should control data value equal with expected defaultValue when id was not provided for InputControl', () => {
			cy.withDataProvider({
				component: <InputControl defaultValue={'10px'} id="invalid" />,
				value: {
					inputControl: {
						value: '300px',
					},
				},
			});
			cy.get('input').should('have.value', '10px');
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
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl type="number" />,
				name,
			});
			cy.get('input[type="number"]').type(100).trigger('change');
			cy.get('input[type="number"]').should('have.value', 100);

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100');
			});

			cy.get('input[type="number"]').clear();
			cy.get('input[type="number"]').type(-100).trigger('change');
			cy.get('input[type="number"]').should('have.value', -100);

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('-100');
			});
		});
		it('should skip string value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl type="number" />,
				name,
			});
			cy.get('input')
				.type('this is a test value')
				.should('not.have.value', 'this is a test value');

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name)).to.undefined;
			});
		});
	});

	describe('unit input', () => {
		it('should change and handle units dropdown ', () => {
			const name = nanoid();
			const units = [
				{ value: 'px', label: 'px', default: 0 },
				{ value: '%', label: '%', default: 10 },
				{ value: 'em', label: 'em', default: 0 },
			];

			cy.withDataProvider({
				component: <InputControl units={units} />,
				name,
			});

			cy.get('input').type(100);
			cy.get('[aria-label="Select unit"]')
				.select('px')
				.should('have.value', 'px');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100px');
			});

			cy.get('[aria-label="Select unit"]')
				.select('%')
				.should('have.value', '%');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100%');
			});

			cy.get('[aria-label="Select unit"]')
				.select('em')
				.should('have.value', 'em');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100em');
			});
		});
		it('should change and handle units dropdown with unit type', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl unitType="background-position" />,
				name,
			});

			cy.get('input').type('100');
			cy.get('[aria-label="Select unit"]')
				.select('%')
				.should('have.value', '%');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100%');
			});

			cy.get('[aria-label="Select unit"]')
				.select('px')
				.should('have.value', 'px');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100px');
			});

			cy.get('[aria-label="Select unit"]')
				.select('vw')
				.should('have.value', 'vw');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100vw');
			});

			cy.get('[aria-label="Select unit"]')
				.select('vh')
				.should('have.value', 'vh');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100vh');
			});

			cy.get('[aria-label="Select unit"]')
				.select('dvw')
				.should('have.value', 'dvw');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100dvw');
			});

			cy.get('[aria-label="Select unit"]')
				.select('dvh')
				.should('have.value', 'dvh');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('100dvh');
			});
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
		it.only('should render css units', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl range unitType="general" />,
				name,
			});
			cy.get('[aria-label="Select unit"]')
				.select('px')
				.should('have.value', 'px');
			cy.get('input[type=range]').should('exist');
			cy.get('input[type=range]').invoke('val', '70').trigger('change');
			cy.get('input[type=range]').should('have.value', '70');
			// cy.get('input[type=number]').should('have.value', '70');
			cy.then(() => {
				expect(getControlValue(name)).to.eq('70px');
			});

			cy.get('[aria-label="Select unit"]')
				.select('auto')
				.should('have.value', 'auto');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('auto');
			});

			cy.get('input[type=range]').should('not.be.visible');
			cy.get('[aria-label="Select unit"]')
				.select('inherit')
				.should('have.value', 'inherit');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('inherit');
			});

			cy.get('input[type=range]').should('not.be.visible');
			cy.get('[aria-label="Select unit"]')
				.select('initial')
				.should('have.value', 'initial');

			// Check data provider value!
			cy.then(() => {
				expect(getControlValue(name)).to.eq('initial');
			});
			cy.get('input[type=range]').should('not.be.visible');
		});
	});
});
