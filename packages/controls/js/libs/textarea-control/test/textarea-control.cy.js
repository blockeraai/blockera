/// <reference types="Cypress" />

import { getControlValue } from '../../../store/selectors';
import { default as TextAreaControl } from '../index';
import { nanoid } from 'nanoid';

describe('textarea control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});

	describe('General', () => {
		it('should render label prop value', () => {
			cy.withDataProvider({
				component: <TextAreaControl label="Example Label" />,
			});

			cy.get('[aria-label="Example Label"]').should('exist');
		});

		it('should control data value must be equal with expected data value passed in data provider access with control identifier', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<TextAreaControl
						defaultValue={'default value'}
						id={'TextAreaControl'}
					/>
				),
				value: {
					TextAreaControl: 'textare value',
				},
				name,
			});

			cy.get('textarea').should('have.value', 'textare value');
			cy.then(() => {
				return expect(getControlValue(name).TextAreaControl).to.eq(
					'textare value'
				);
			});
		});

		it('should control data value equal with expected defaultValue when id of context value was not defined', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<TextAreaControl
						defaultValue={'default value'}
						id={'TextAreaControl.value'}
					/>
				),
				value: {
					TextAreaControl: {
						value: undefined,
					},
				},
				name,
			});

			cy.get('textarea').should('have.value', 'default value');
			cy.then(() => {
				return expect(
					getControlValue(name).TextAreaControl.value
				).to.eq(undefined);
			});
		});

		it('should control data value equal with expected defaultValue when id was not provided for TextAreaControl', () => {
			cy.withDataProvider({
				component: (
					<TextAreaControl
						defaultValue={'default value'}
						id="invalid"
					/>
				),
				value: {
					TextAreaControl: {
						value: 'value',
					},
				},
				name,
			});
			cy.get('textarea').should('have.value', 'default value');
		});

		it('should render placeholder', () => {
			cy.withDataProvider({
				component: <TextAreaControl placeholder="My placeholder" />,
			});

			cy.get('textarea[placeholder*="My placeholder"]').should('exist');
		});

		it('disabled', () => {
			cy.withDataProvider({
				component: <TextAreaControl disabled={true} />,
			});

			cy.get('textarea').should('be.disabled');
		});
	});

	describe('Text Input', () => {
		it('should display value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <TextAreaControl defaultValue={'default value'} />,
				name,
				value: 'value',
			});

			cy.get('textarea').should('have.value', 'value');
			cy.then(() => {
				return expect(getControlValue(name)).to.eq('value');
			});
		});

		it('should display default value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <TextAreaControl defaultValue={'default value'} />,
				name,
				value: '',
			});

			cy.get('textarea').should('have.value', 'default value');
			cy.then(() => {
				return expect(getControlValue(name)).to.eq('');
			});
		});

		it('should display onchanged value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <TextAreaControl />,
				name,
			});

			cy.get('textarea').type('test');
			cy.should('have.value', 'test');
			cy.then(() => {
				return expect(getControlValue(name)).to.eq('test');
			});
		});

		it('should render clear input', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <TextAreaControl />,
				name,
			});

			cy.get('textarea').type('this is a text');
			cy.get('textarea').clear();
			cy.get('textarea').should('have.value', '');
			cy.then(() => {
				return expect(getControlValue(name)).to.eq('');
			});
		});
	});
});
