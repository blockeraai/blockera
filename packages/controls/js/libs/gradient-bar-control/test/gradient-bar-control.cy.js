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

const addGradientControlPoint = () => {
	// WP 31+ shows the inserter on hover (not click) and opens the color picker from the plus button.
	cy.getByDataCy('gradient-bar-control')
		.find('.components-custom-gradient-picker__gradient-bar')
		.realHover()
		.then(($bar) => {
			const { width, height } = $bar[0].getBoundingClientRect();

			cy.wrap($bar).realMouseMove(
				Math.round(width / 2),
				Math.round(height / 2)
			);
		});

	cy.get('.components-custom-gradient-picker__insert-point-dropdown')
		.should('be.visible')
		.click();

	cy.get('[aria-label="Color"]').click();
	cy.get('.components-popover').clickOutside();
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
			value: 'linear-gradient(135deg,rgb(6,147,227)',
		});
		cy.get('[aria-label="My Label"]').should('contain', 'My Label');
	});

	it('should display two pointer in initial state', () => {
		cy.withDataProvider({
			component: <GradientBarControl label="My Label" />,
			value: 'linear-gradient(135deg,rgb(6,147,227)',
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
			value: 'linear-gradient(135deg,rgb(6,147,227)',
			skipSyncValue: false,
		});
		addGradientControlPoint();
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
			value: 'linear-gradient(135deg,rgb(6,147,227)',
		});
		addGradientControlPoint();
		cy.get('@onChangeMock').should('have.been.called');
	});

	it('should change provider after change component state', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <GradientBarControl label="my toggle" />,
			name,
			value: 'linear-gradient(135deg,rgb(6,147,227)',
		});

		addGradientControlPoint();
	});

	it('should render remove color pointer', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <GradientBarControl label="my toggle" />,
			value: 'linear-gradient(135deg,rgb(6,147,227)',
			name,
		});
		cy.getByDataCy('gradient-bar-control')
			.find('button')
			.should('have.length', 2);
		// add new pointer
		addGradientControlPoint();
		// check pointers length
		cy.getByDataCy('gradient-bar-control')
			.find('button')
			.should('have.length', 3);
		// remove new pointer (inserted between the two default stops)
		cy.getByDataCy('gradient-bar-control')
			.find('.components-custom-gradient-picker__control-point-button')
			.then(($buttons) => {
				const middleButton = [...$buttons].find((button) => {
					const match = button
						.getAttribute('aria-label')
						?.match(/position (\d+)%/);
					const position = match ? Number(match[1]) : -1;

					return position > 0 && position < 100;
				});

				expect(middleButton, 'middle control point').to.exist;
				cy.wrap(middleButton).click();
			});
		cy.contains('button', 'Remove Control Point').click();
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
			value: 'linear-gradient(135deg,rgb(6,147,227)',
			name,
		});
		cy.getByDataCy('gradient-bar-control')
			.find('.components-custom-gradient-picker__control-point-button')
			.first()
			.click();
		cy.get('input[maxlength="9"]').then(($input) => {
			const val = $input.val();
			cy.getByDataCy('gradient-bar-control')
				.find(
					'.components-custom-gradient-picker__control-point-button'
				)
				.first()
				.invoke('attr', 'aria-label')
				.then((ariaLabel) => {
					const colorMatch = ariaLabel.match(/color code ([^.]+)\./);
					const buttonColor = colorMatch?.[1] ?? '';
					const inputRgb = hexToRgb(`#${val}`);

					expect(buttonColor.replace(/\s/g, '')).to.equal(
						`rgba(${inputRgb.r},${inputRgb.g},${inputRgb.b},1)`
					);
				});
		});
	});
});
