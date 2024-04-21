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
			const defaultValue = {
				0: {
					x: '10px',
					y: '10px',
					blur: '4px',
					color: '#0747eb',
					isVisible: true,
				},
				1: {
					x: '2px',
					y: '3px',
					blur: '4px',
					color: '#0947eb',
					isVisible: true,
				},
			};
			cy.withDataProvider({
				component: <TextShadowControl label="text shadow" />,

				value: defaultValue,
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('blockera-repeater-control')
				.find('[data-cy="repeater-item"]')
				.should('have.length', 2);

			// Check data provider value!
			cy.then(() => {
				return expect(getControlValue(name, STORE_NAME)).to.deep.eq(
					defaultValue
				);
			});
		});
	});

	describe('fill', () => {
		it('should display custom repeater header', () => {
			cy.withDataProvider({
				component: <TextShadowControl label="text shadow" />,

				value: {
					0: {
						x: '10px',
						y: '10px',
						blur: '4px',
						color: '#0747eb',
						isVisible: true,
					},
				},
				store: STORE_NAME,
			});

			cy.getByDataCy('text-shadow-repeater-item-header').should(
				'be.visible'
			);
			cy.getByDataCy('header-icon').should('be.visible');
			cy.getByDataCy('header-label').should('be.visible');
			cy.getByDataCy('header-values').should('be.visible');
		});

		it('should display popover label', () => {
			cy.withDataProvider({
				component: (
					<TextShadowControl
						label="text shadow"
						popoverTitle="My Popover Label"
					/>
				),

				value: {
					0: {
						x: '10px',
						y: '10px',
						blur: '4px',
						color: '#0747eb',
						isVisible: true,
					},
				},
				store: STORE_NAME,
			});

			cy.getByDataCy('repeater-item').click();
			cy.contains('My Popover Label');
		});

		it('should add custom classname', () => {
			cy.withDataProvider({
				component: (
					<TextShadowControl
						label="text shadow"
						popoverTitle="Text Shadow"
						className="custom-class"
					/>
				),

				value: {},
				store: STORE_NAME,
			});

			cy.get('[aria-label="Add New Text Shadow"]').click();
			cy.get('.blockera-control-text-shadow').should(
				'have.class',
				'custom-class'
			);
		});

		it('should render add new text shadow item', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<TextShadowControl
						label="text shadow"
						popoverTitle="Text Shadow"
					/>
				),

				value: {},
				store: STORE_NAME,
				name,
			});

			cy.get('[aria-label="Add New Text Shadow"]').click();

			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('[aria-label="Vertical Distance"]')
				.clear()
				.type(50)
				.should('have.value', '50');

			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('[aria-label="Horizontal Distance"]')
				.clear()
				.type(50)
				.should('have.value', '50');

			/* eslint-disable cypress/unsafe-to-chain-command */
			cy.get('[aria-label="Blur Effect"]')
				.clear()
				.type(50)
				.should('have.value', '50');

			cy.get('.blockera-control-color').click();
			cy.getByDataCy('repeater-item').clickOutside();

			// Check data provider value!
			cy.then(() => {
				const controlValue = getControlValue(name, STORE_NAME);
				const data = {
					0: {
						...controlValue[0],
						x: '50px',
						y: '50px',
						blur: '50px',
						isVisible: true,
					},
				};
				return expect(controlValue).to.deep.eq(data);
			});
		});
	});
});
