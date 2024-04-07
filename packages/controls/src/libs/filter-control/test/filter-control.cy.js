import FilterControl from '..';
import { STORE_NAME } from '../../repeater-control/store';
import { nanoid } from 'nanoid';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';

describe('filter-control component testing', () => {
	it('should render correctly', () => {
		cy.withDataProvider({
			component: <FilterControl />,
			store: STORE_NAME,
			value: {
				'blur-0': {
					type: 'blur',
					blur: '0px',
				},
			},
		});

		cy.getByDataCy('group-control-header').should('exist');
	});

	it('should render correctly with empty value', () => {
		cy.withDataProvider({
			component: <FilterControl />,
			store: STORE_NAME,
			value: {},
		});

		cy.getByDataCy('group-control-header').should('not.exist');
	});

	it('should render correctly without passing value and defaultValue', () => {
		cy.withDataProvider({
			component: <FilterControl />,
			store: STORE_NAME,
		});

		cy.getByDataCy('group-control-header').should('not.exist');
	});

	it('should render correctly with defaultValue', () => {
		cy.withDataProvider({
			component: (
				<FilterControl
					defaultValue={{
						'drop-shadow-0': {
							type: 'drop-shadow',
							'drop-shadow-x': '10px',
							'drop-shadow-y': '10px',
							'drop-shadow-blur': '10px',
							'drop-shadow-color': '',
						},
					}}
				/>
			),
			store: STORE_NAME,
		});

		cy.getByDataCy('group-control-header').contains('Drop Shadow');
	});

	it('should render correctly with label', () => {
		cy.withDataProvider({
			component: <FilterControl label="Filter Control" />,
			store: STORE_NAME,
		});

		cy.contains('Filter Control');
	});

	describe('interaction test :', () => {
		it('should onChange be called, when interacting', () => {
			const name = nanoid();
			const defaultProps = {
				onChange: (value) => {
					controlReducer(
						select('publisher-core/controls').getControl(name),
						modifyControlValue({
							value,
							controlId: name,
						})
					);
				},
			};
			cy.stub(defaultProps, 'onChange').as('onChange');

			cy.withDataProvider({
				component: <FilterControl {...defaultProps} />,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '0px',
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('drop-shadow');

			cy.get('@onChange').should('have.been.called');
		});

		it('should context and local value be updated,when select blur and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: {
					'drop-shadow-0': {
						type: 'drop-shadow',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
					},
				},
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('blur');
			cy.getByDataTest('filter-blur-input').clear();
			cy.getByDataTest('filter-blur-input').type(25);

			//Check value
			cy.get('select').eq(0).should('have.value', 'blur');
			cy.getByDataTest('filter-blur-input').should('have.value', '25');

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('Blur');
			cy.getByDataCy('group-control-header').contains('25px');

			//Check data provider value
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);
				expect({
					'blur-0': {
						...controlValue['blur-0'],
						type: 'blur',
						blur: '25px',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should context and local value be updated,when select drop shadow and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '20px',
					},
				},
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('drop-shadow');

			cy.getByDataTest('filter-drop-shadow-x-input').clear();
			cy.getByDataTest('filter-drop-shadow-x-input').type(100);

			cy.getByDataTest('filter-drop-shadow-y-input').clear();
			cy.getByDataTest('filter-drop-shadow-y-input').type(55);

			cy.getByDataTest('filter-drop-shadow-blur-input').clear();
			cy.getByDataTest('filter-drop-shadow-blur-input').type(15);

			cy.getByDataTest('filter-drop-shadow-color').click();
			cy.contains('Color Picker').as('color-picker');
			cy.get('@color-picker').get('input[maxlength="9"]').clear();
			cy.get('@color-picker').get('input[maxlength="9"]').type('2cf1dd');

			//Check value
			cy.get('select').eq(0).should('have.value', 'drop-shadow');
			cy.getByDataTest('filter-drop-shadow-x-input').should(
				'have.value',
				'100'
			);
			cy.getByDataTest('filter-drop-shadow-y-input').should(
				'have.value',
				'55'
			);
			cy.getByDataTest('filter-drop-shadow-blur-input').should(
				'have.value',
				'15'
			);
			cy.getByDataTest('filter-drop-shadow-color').contains('#2cf1dd');

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('Drop Shadow');
			cy.getByDataCy('group-control-header').contains('100');
			cy.getByDataCy('group-control-header').contains('55');
			cy.getByDataCy('group-control-header').contains('15');

			//Check data provider value
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);

				expect({
					'drop-shadow-0': {
						...controlValue['drop-shadow-0'],
						type: 'drop-shadow',
						'drop-shadow-x': '100px',
						'drop-shadow-y': '55px',
						'drop-shadow-blur': '15px',
						'drop-shadow-color': '#2cf1dd',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should context and local value be updated,when select brightness and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '20px',
					},
				},
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('brightness');
			cy.getByDataTest('filter-brightness-input').clear();
			cy.getByDataTest('filter-brightness-input').type(100);

			//Check value
			cy.get('select').eq(0).should('have.value', 'brightness');
			cy.getByDataTest('filter-brightness-input').should(
				'have.value',
				'100'
			);

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('Brightness');
			cy.getByDataCy('group-control-header').contains('100%');

			//Check data provider value
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);
				expect({
					'brightness-0': {
						...controlValue['brightness-0'],
						type: 'brightness',
						brightness: '100%',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should context and local value be updated,when select contrast and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '20px',
					},
				},
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('contrast');
			cy.getByDataTest('filter-contrast-input').clear();
			cy.getByDataTest('filter-contrast-input').type(80);

			//Check value
			cy.get('select').eq(0).should('have.value', 'contrast');
			cy.getByDataTest('filter-contrast-input').should(
				'have.value',
				'80'
			);

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('Contrast');
			cy.getByDataCy('group-control-header').contains('80%');

			//Check data provider value
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);

				expect({
					'contrast-0': {
						...controlValue['contrast-0'],
						type: 'contrast',
						contrast: '80%',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should context and local value be updated,when select hue-rotate and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '20px',
					},
				},
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('hue-rotate');
			cy.getByDataTest('filter-hue-rotate-input').clear();
			cy.getByDataTest('filter-hue-rotate-input').type(30);

			//Check value
			cy.get('select').eq(0).should('have.value', 'hue-rotate');
			cy.getByDataTest('filter-hue-rotate-input').should(
				'have.value',
				'30'
			);

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('Hue Rotate');
			cy.getByDataCy('group-control-header').contains('30');

			//Check data provider value
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);

				expect({
					'hue-rotate-0': {
						...controlValue['hue-rotate-0'],
						type: 'hue-rotate',
						'hue-rotate': '30deg',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should context and local value be updated,when select saturate and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '20px',
					},
				},
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('saturate');
			cy.getByDataTest('filter-saturate-input').clear();
			cy.getByDataTest('filter-saturate-input').type(150);

			//Check value
			cy.get('select').eq(0).should('have.value', 'saturate');
			cy.getByDataTest('filter-saturate-input').should(
				'have.value',
				'150'
			);

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('Saturation');
			cy.getByDataCy('group-control-header').contains('150%');

			//Check data provider value
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);

				expect({
					'saturate-0': {
						...controlValue['saturate-0'],
						type: 'saturate',
						saturate: '150%',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should context and local value be updated,when select grayscale and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '20px',
					},
				},
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('grayscale');
			cy.getByDataTest('filter-grayscale-input').clear();
			cy.getByDataTest('filter-grayscale-input').type(50);

			//Check value
			cy.get('select').eq(0).should('have.value', 'grayscale');
			cy.getByDataTest('filter-grayscale-input').should(
				'have.value',
				'50'
			);

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('Grayscale');
			cy.getByDataCy('group-control-header').contains('50%');

			//Check data provider value
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);

				expect({
					'grayscale-0': {
						...controlValue['grayscale-0'],
						type: 'grayscale',
						grayscale: '50%',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should context and local value be updated,when select invert and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '20px',
					},
				},
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('invert');
			cy.getByDataTest('filter-invert-input').clear();
			cy.getByDataTest('filter-invert-input').type(70);

			//Check value
			cy.get('select').eq(0).should('have.value', 'invert');
			cy.getByDataTest('filter-invert-input').should('have.value', '70');

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('Invert');
			cy.getByDataCy('group-control-header').contains('70%');

			//Check data provider value
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);

				expect({
					'invert-0': {
						...controlValue['invert-0'],
						type: 'invert',
						invert: '70%',
					},
				}).to.be.deep.equal(controlValue);
			});
		});

		it('should context and local value be updated,when select sepia and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '20px',
					},
				},
			});

			cy.getByDataCy('group-control-header').click();

			cy.get('select').eq(0).select('sepia');
			cy.getByDataTest('filter-sepia-input').clear();
			cy.getByDataTest('filter-sepia-input').type(40);

			//Check value
			cy.get('select').eq(0).should('have.value', 'sepia');
			cy.getByDataTest('filter-sepia-input').should('have.value', '40');

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('Sepia');
			cy.getByDataCy('group-control-header').contains('40%');

			//Check data provider value
			cy.get('body').then(() => {
				const controlValue = getControlValue(name, STORE_NAME);

				expect({
					'sepia-0': {
						...controlValue['sepia-0'],
						type: 'sepia',
						sepia: '40%',
					},
				}).to.be.deep.equal(controlValue);
			});
		});
	});

	describe('pass isOpen', () => {
		it('should popover not be open at first rendering, when passing false (default)', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl popoverTitle="Filter Control" />,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '0px',
						isOpen: false,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.contains('Filter Control').should('not.exist');
		});

		it('should popover be open at first rendering, when passing true', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl popoverTitle="Filter Control" />,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '0px',
						isOpen: true,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.contains('Filter Control').should('exist');
		});
	});

	describe('pass isVisible', () => {
		it('should repeater item be visible, when passing true (default)', () => {
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '0px',
						isVisible: true,
					},
				},
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-active');
		});

		it('should repeater item be invisible, when passing false', () => {
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				value: {
					'blur-0': {
						type: 'blur',
						blur: '0px',
						isVisible: false,
					},
				},
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-inactive');
		});
	});
});
