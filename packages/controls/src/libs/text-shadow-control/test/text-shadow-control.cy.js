/// <reference types="Cypress" />
/**
 * External dependencies
 */
import { nanoid } from 'nanoid';
/**
 * Internal dependencies
 */
import { TextShadowControl } from '../../..';
import { STORE_NAME } from '../../repeater-control/store';
import { getControlValue } from '../../../store/selectors';

describe('ext shadow control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});

	describe('empty', () => {
		it('should display default value', () => {
			const name = nanoid();
			const defaultValue = [
				{
					x: '10px',
					y: '10px',
					blur: '4px',
					color: '#0747eb',
					isVisible: true,
				},
				{
					x: '2px',
					y: '3px',
					blur: '4px',
					color: '#0947eb',
					isVisible: true,
				},
			];
			cy.withDataProvider({
				component: <TextShadowControl label="text shadow" />,

				value: defaultValue,
				store: STORE_NAME,
				name,
			});

			cy.get('.publisher-control-repeater')
				.find('.publisher-control-repeater-item')
				.should('have.length', 2);

			// Check data provider value!
			cy.then(() => {
				console.log('value: ', getControlValue(name, STORE_NAME));
				expect(getControlValue(name, STORE_NAME)).to.deep.eq(
					defaultValue
				);
			});
		});
	});

	describe.only('fill', () => {
		it('should display custom repeater header', () => {
			cy.withDataProvider({
				component: <TextShadowControl label="text shadow" />,

				value: [
					{
						x: '10px',
						y: '10px',
						blur: '4px',
						color: '#0747eb',
						isVisible: true,
					},
				],
				store: STORE_NAME,
			});

			cy.getByDataCy('text-shadow-repeater-item-header').should(
				'be.visible'
			);
			cy.getByDataCy('header-icon').should('be.visible');
			cy.getByDataCy('header-label').should('be.visible');
			cy.getByDataCy('header-values').should('be.visible');
		});
	});
});
