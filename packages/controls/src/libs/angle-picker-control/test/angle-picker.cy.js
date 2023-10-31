import { AnglePickerControl } from '../../..';
import { getControlValue } from '../../../store/selectors';

describe('angle-picker-control', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('Visual Tests', () => {
		it('renders angle picker and input and left/right buttons as default state', () => {
			const name = 'angle-picker-1';
			cy.withDataProvider({
				component: <AnglePickerControl />,
				value: 0,
				name,
			});

			cy.get('input');
			cy.get('[aria-label="Rotate Left"]');
			cy.get('[aria-label="Rotate Right"]');
		});

		it('renders not render buttons when rotateButtons=false', () => {
			const name = 'angle-picker-1';
			cy.withDataProvider({
				component: <AnglePickerControl rotateButtons={false} />,
				value: 0,
				name,
			});

			cy.get('[aria-label="Rotate Left"]').should('not.exist');
			cy.get('[aria-label="Rotate Right"]').should('not.exist');
		});
	});

	context('Functional Tests', () => {
		context('Input Interactions', () => {
			it('should take new value by entering positive numbers in range 0-360', () => {
				const name = 'angle-picker-f1';
				cy.withDataProvider({
					component: <AnglePickerControl rotateButtons={true} />,
					value: '0',
					name,
				});

				cy.get('input[type="number"]').clear();
				cy.get('input[type="number"]').type('245{enter}');

				// visual assertion
				cy.get('input[type="number"]')
					.should('have.value', 245)
					.then(() => {
						// data assertion
						expect(getControlValue(name)).to.be.equal(245);
					});
			});

			it('should take value 360 if the entered number is more than 360', () => {
				const name = 'angle-picker-f2';
				cy.withDataProvider({
					component: <AnglePickerControl rotateButtons={true} />,
					value: '0',
					name,
				});

				cy.get('input[type="number"]').clear();
				cy.get('input[type="number"]').type('500{enter}');

				// visual assertion
				cy.get('input[type="number"]')
					.should('have.value', 360)
					.then(() => {
						// data assertion
						expect(getControlValue(name)).to.be.equal(360);
					});
			});
		});

		context('Left/Right Buttons Interactions', () => {
			it('should decrease 45deg per click by clicking on left button', () => {
				const name = 'angle-picker-f3';
				cy.withDataProvider({
					component: <AnglePickerControl rotateButtons={true} />,
					value: 360,
					name,
				});

				cy.get('[aria-label="Rotate Left"]').click();
				cy.get('[aria-label="Rotate Left"]').click();

				// visual assertion
				cy.get('input[type="number"]')
					.should('have.value', 270)
					.then(() => {
						// data assertion
						expect(getControlValue(name)).to.be.equal(270);
					});
			});

			it('should increase 45deg per click by clicking on right button', () => {
				const name = 'angle-picker-f4';
				cy.withDataProvider({
					component: <AnglePickerControl rotateButtons={true} />,
					value: 0,
					name,
				});

				cy.get('[aria-label="Rotate Right"]').click();
				cy.get('[aria-label="Rotate Right"]').click();

				// visual assertion
				cy.get('input[type="number"]')
					.should('have.value', 90)
					.then(() => {
						// data assertion
						expect(getControlValue(name)).to.be.equal(90);
					});
			});

			it('should continue to increase form zero when the result of addition is more that 360', () => {
				const name = 'angle-picker-f5';

				cy.withDataProvider({
					component: <AnglePickerControl rotateButtons={true} />,
					value: 350,
					name,
				});

				cy.get('[aria-label="Rotate Right"]').click();

				// visual assertion
				cy.get('input[type="number"]')
					.should('have.value', 35)
					.then(() => {
						// data assertion
						expect(getControlValue(name)).to.be.equal(35);
					});
			});

			it('should continue to decrease form 360 when the result of subtraction is less than 0', () => {
				const name = 'angle-picker-f6';

				cy.withDataProvider({
					component: <AnglePickerControl rotateButtons={true} />,
					value: 15,
					name,
				});

				cy.get('[aria-label="Rotate Left"]').click();

				// visual assertion
				cy.get('input[type="number"]')
					.should('have.value', 330)
					.then(() => {
						// data assertion
						expect(getControlValue(name)).to.be.equal(330);
					});
			});
		});

		context('Angle Interactions', () => {
			it('should change the value by dragging angle', () => {
				const name = 'angle-picker-angle1';
				cy.withDataProvider({
					component: <AnglePickerControl rotateButtons={true} />,
					value: '0',
					name,
				});

				cy.get(
					'.components-angle-picker-control__angle-circle-indicator'
				).as('indicator');

				cy.get('@indicator').trigger('mousedown', { which: 1 });
				cy.get('@indicator').trigger('mousemove', {
					which: 1,
					clientX: 20,
					clientY: 30,
				});
				cy.get('@indicator').trigger('mouseup');
				// visual assertion
				cy.get('input[type="number"]')
					.should('have.value', 270)
					.then(() => {
						// data assertion
						expect(getControlValue(name)).to.be.equal(270);
					});
			});
		});
	});

	context("Control's initial value", () => {
		// 1.
		it('retrieved data must be defaultValue, when defaultValue(ok) && id(!ok) value(undefined)', () => {
			cy.withDataProvider({
				component: <AnglePickerControl defaultValue="45" id="y.x" />,
				value: undefined,
			});

			cy.get('input[type="number"]').should('have.value', '45');
		});

		// 2.
		it('retrieved data must be defaultValue, when defaultValue(ok) && id(!ok) && value(ok)', () => {
			cy.withDataProvider({
				component: <AnglePickerControl defaultValue="45" id="x.y" />,
				value: '90',
			});

			cy.get('input[type="number"]').should('have.value', '45');
		});

		// 3.
		it('retrieved data must be defaultValue, when defaultValue(ok) && id(ok) && value(undefined)', () => {
			cy.withDataProvider({
				component: (
					<AnglePickerControl id="x[0].b[0].c" defaultValue="45" />
				),
				value: {
					x: [
						{
							b: [
								{
									c: undefined,
								},
							],
						},
					],
				},
			});

			cy.get('input[type="number"]').should('have.value', '45');
		});

		// 4.
		it('retrieved data must be value, when id(!ok), defaultValue(!ok), value(root)', () => {
			cy.withDataProvider({
				component: <AnglePickerControl />,
				value: '90',
			});

			cy.get('input[type="number"]').should('have.value', '90');
		});
	});
});
