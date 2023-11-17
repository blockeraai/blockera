/// <reference types="Cypress" />

import { nanoid } from 'nanoid';
import GradientBarControl from '../';
import { getControlValue } from '../../../store/selectors';

const hexToRgb = (hex) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
};

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
	it('should display two pointer in initial state', () => {
		cy.withDataProvider({
			component: <GradientBarControl label="My Label" />,
			value: [],
		});
		cy.getByDataCy('gradient-bar-control')
			.find('button')
			.should('have.length', 2);
	});
	it('should render default value', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <GradientBarControl label="My Label" />,
			value: 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(128,64,64) 50%,rgb(155,81,224) 100%)',
			name,
		});

		// Check data provider value!
		cy.then(() => {
			return expect(getControlValue(name)).to.eq(
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(128,64,64) 50%,rgb(155,81,224) 100%)'
			);
		});
	});
	it('should render default value with id', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <GradientBarControl label="My Label" id="a.b" />,
			value: {
				a: {
					b: 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(128,64,64) 50%,rgb(155,81,224) 100%)',
				},
			},
			name,
		});

		// Check data provider value!
		cy.then(() => {
			return expect(getControlValue(name).a.b).to.eq(
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(128,64,64) 50%,rgb(155,81,224) 100%)'
			);
		});
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
	it('should render onchange when component changed', () => {
		const onChangeMock = cy.stub().as('onChangeMock');
		cy.withDataProvider({
			component: (
				<GradientBarControl label="my toggle" onChange={onChangeMock} />
			),
		});
		cy.getByDataCy('gradient-bar-control').click();
		cy.get('[aria-label="Color"]').click();
		cy.get('.components-popover').clickOutside();
		cy.get('@onChangeMock').should('have.been.called');
	});
	it('should change provider after change component state', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <GradientBarControl label="my toggle" />,
			name,
			value: '',
		});

		cy.getByDataCy('gradient-bar-control').click();
		cy.get('[aria-label="Color"]').click();
		cy.get('.components-popover').clickOutside();

		// Check data provider value!
		cy.then(() => {
			return expect(getControlValue(name)).to.eq(
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(128,64,64) 50%,rgb(155,81,224) 100%)'
			);
		});
	});
	it('should render remove color pointer', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <GradientBarControl label="my toggle" />,
			name,
		});
		cy.getByDataCy('gradient-bar-control')
			.find('button')
			.should('have.length', 2);
		// add new pointer
		cy.getByDataCy('gradient-bar-control').click();
		cy.get('[aria-label="Color"]').click();
		cy.get('.components-popover').clickOutside();
		// check pointers length
		cy.getByDataCy('gradient-bar-control')
			.find('button')
			.should('have.length', 3);
		// remove new pointer
		cy.getByDataCy('gradient-bar-control').find('button').eq(1).click();
		cy.get('button').contains('Remove Control Point').click();
		// check pointers length
		cy.getByDataCy('gradient-bar-control')
			.find('button')
			.should('have.length', 2);

		// Check data provider value!
		cy.then(() => {
			return expect(getControlValue(name)).to.eq(
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(155,81,224) 100%)'
			);
		});
	});
	it('should display correct pointer color', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <GradientBarControl label="My Label" />,
			name,
		});
		cy.get('button').first().click();
		cy.get('input[maxlength="9"]').then(($input) => {
			// color input value
			const val = $input.val();
			// get button color value
			cy.get('button')
				.first()
				.invoke('attr', 'aria-label')
				.then((classList) => {
					// WP render colors to aria label
					// pick color from aria label
					const buttonAriaLabel = classList.split(' ')[9];

					// convert input hex color to rgb
					const inputRgb = hexToRgb(`#${val}`);

					expect(buttonAriaLabel).to.equal(
						`rgba(${inputRgb.r},${inputRgb.g},${inputRgb.b},1).`
					);
				});
		});
	});
});
