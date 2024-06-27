import BoxShadowControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';
import { nanoid } from 'nanoid';

describe(
	'box-shadow-control component testing',
	{
		defaultCommandTimeout: 20000,
	},
	() => {
		it('should render correctly', () => {
			cy.withDataProvider({
				component: <BoxShadowControl />,
				store: STORE_NAME,
				value: {
					'outer-0': {
						type: 'outer',
						x: '10px',
						y: '10px',
						order: 0,
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: true,
					},
				},
			});

			cy.getByDataCy('repeater-item').should('exist');
		});

		it('should render correctly with empty value', () => {
			cy.withDataProvider({
				component: <BoxShadowControl />,
				store: STORE_NAME,
				value: [],
			});

			cy.getByDataCy('repeater-item').should('not.exist');
		});

		it('should render correctly without value and defaultValue', () => {
			cy.withDataProvider({
				component: <BoxShadowControl />,
				store: STORE_NAME,
			});

			cy.getByDataCy('repeater-item').should('not.exist');
		});

		it('should render correctly with defaultValue', () => {
			cy.withDataProvider({
				component: (
					<BoxShadowControl
						defaultValue={{
							inner: {
								type: 'inner',
								x: '5px',
								y: '5px',
								order: 0,
								blur: '5px',
								spread: '5px',
								color: '#cccccc',
								isVisible: true,
							},
						}}
					/>
				),
				store: STORE_NAME,
			});

			cy.getByDataCy('repeater-item').contains('Inner');
		});

		it('should render correctly with Outer label', () => {
			cy.withDataProvider({
				component: <BoxShadowControl label={'Box Shadow'} />,
				store: STORE_NAME,
				value: {
					'outer-0': {
						type: 'outer',
						x: '10px',
						y: '10px',
						order: 0,
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: true,
					},
				},
			});

			cy.getByDataCy('repeater-item').contains('Outer');
		});

		it('should render correctly with Inner label', () => {
			cy.withDataProvider({
				component: <BoxShadowControl label={'Box Shadow'} />,
				store: STORE_NAME,
				value: {
					'inner-0': {
						type: 'inner',
						x: '10px',
						y: '10px',
						order: 0,
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: true,
					},
				},
			});

			cy.getByDataCy('repeater-item').contains('Inner');
		});

		describe('interaction test: ', () => {
			it('should onChange be called when interacting', () => {
				const name = nanoid();
				const defaultProps = {
					onChange: (value) => {
						controlReducer(
							select('blockera/controls').getControl(name),
							modifyControlValue({
								value,
								controlId: name,
							})
						);
					},
				};

				cy.stub(defaultProps, 'onChange').as('onChange');

				cy.withDataProvider({
					component: (
						<BoxShadowControl
							popoverTitle="Box Shadow"
							{...defaultProps}
						/>
					),
					value: {
						'outer-0': {
							type: 'outer',
							x: '0px',
							y: '0px',
							blur: '0px',
							spread: '0px',
							order: 0,
							color: '#000000ab',
							isVisible: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.getByDataCy('repeater-item').click();

				cy.get('.blockera-component-popover')
					.within(() => {
						cy.get('button[aria-label="Inner"]').click();
					})
					.then(() => {
						cy.get('@onChange').should('have.been.called');
					});
			});

			it('should context value have length of 1, when adding one more item because more items available on PRO version', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BoxShadowControl label={'Box Shadow'} />,
					value: {
						'outer-0': {
							type: 'outer',
							x: '10px',
							y: '10px',
							order: 0,
							blur: '10px',
							spread: '10px',
							color: '#cccccc',
							isVisible: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				cy.get('button[aria-label="Add New Box Shadow"]').click();

				cy.getByDataTest('popover-body').contains('Upgrade to PRO');

				cy.getByDataCy('repeater-item').should('have.length', '1');

				//Check data provider value
				cy.get('body').then(() => {
					expect(1).to.be.equal(
						Object.keys(getControlValue(name, STORE_NAME)).length
					);
				});
			});

			it('should context and local value be updated, when changing values (type:outer)', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BoxShadowControl popoverTitle={'Box Shadow'} />,
					value: {
						'outer-0': {
							type: 'outer',
							x: '10px',
							y: '10px',
							order: 0,
							blur: '10px',
							spread: '10px',
							color: '#cccccc',
							isVisible: true,
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				// Wait for the popover to ensure the component is fully rendered
				cy.get('.blockera-component-popover', {
					timeout: 20000,
				}).should('be.visible');

				cy.getByDataCy('repeater-item').as('repeater-item');

				cy.get('.blockera-component-popover').within(() => {
					//change x
					cy.getByDataTest('box-shadow-x-input').clear();
					cy.getByDataTest('box-shadow-x-input').type(20);
					cy.getByDataTest('box-shadow-x-input').should(
						'have.value',
						'20'
					);

					//change y
					cy.getByDataTest('box-shadow-y-input').clear();
					cy.getByDataTest('box-shadow-y-input').type(40);
					cy.getByDataTest('box-shadow-y-input').should(
						'have.value',
						'40'
					);

					//change blur
					cy.getByDataTest('box-shadow-blur-input').clear();
					cy.getByDataTest('box-shadow-blur-input').type(35);
					cy.getByDataTest('box-shadow-blur-input').should(
						'have.value',
						'35'
					);

					//change spread
					cy.getByDataTest('box-shadow-spread-input').clear();
					cy.getByDataTest('box-shadow-spread-input').type(25);
					cy.getByDataTest('box-shadow-spread-input').should(
						'have.value',
						'25'
					);

					//change color
					cy.getByDataTest('box-shadow-color-control').click();
				});

				cy.get('.blockera-component-popover').last().as('color-picker');
				cy.get('@color-picker').within(() => {
					cy.get('@color-picker').get('input[maxlength="9"]').clear();
					cy.get('@color-picker')
						.get('input[maxlength="9"]')
						.type('2cf1dd');
				});
				cy.getByDataTest('box-shadow-color-control').contains(
					'#2cf1dd'
				);

				//check repeater item value
				cy.get('@repeater-item').within(() => {
					cy.contains('Outer');
					cy.contains('20');
					cy.contains('40');
					cy.contains('35');
					cy.contains('25');
					cy.get('.blockera-component-color-indicator').should(
						'have.attr',
						'style',
						'background: rgb(44, 241, 221);'
					);
				});

				//Check data provider value
				cy.get('body').then(() => {
					expect({
						'outer-0': {
							type: 'outer',
							x: '20px',
							y: '40px',
							order: 0,
							blur: '35px',
							spread: '25px',
							color: '#2cf1dd',
							isVisible: true,
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});

			it('should context and local value be updated, when changing values (type:inner)', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BoxShadowControl popoverTitle={'Box Shadow'} />,
					value: {
						'inner-0': {
							type: 'inner',
							x: '10px',
							y: '10px',
							blur: '10px',
							spread: '10px',
							color: '#cccccc',
							isVisible: true,
							order: 0,
							isOpen: true,
						},
					},
					store: STORE_NAME,
					name,
				});

				// Wait for the popover to ensure the component is fully rendered
				cy.get('.blockera-component-popover', {
					timeout: 20000,
				}).should('be.visible');

				cy.getByDataCy('repeater-item').as('repeater-item');

				cy.get('.blockera-component-popover').within(() => {
					//change x
					cy.getByDataTest('box-shadow-x-input').clear();
					cy.getByDataTest('box-shadow-x-input').type(40);
					cy.getByDataTest('box-shadow-x-input').should(
						'have.value',
						'40'
					);

					//change y
					cy.getByDataTest('box-shadow-y-input').clear();
					cy.getByDataTest('box-shadow-y-input').type(60);
					cy.getByDataTest('box-shadow-y-input').should(
						'have.value',
						'60'
					);

					//change blur
					cy.getByDataTest('box-shadow-blur-input').clear();
					cy.getByDataTest('box-shadow-blur-input').type(15);
					cy.getByDataTest('box-shadow-blur-input').should(
						'have.value',
						'15'
					);

					//change spread
					cy.getByDataTest('box-shadow-spread-input').clear();
					cy.getByDataTest('box-shadow-spread-input').type(55);
					cy.getByDataTest('box-shadow-spread-input').should(
						'have.value',
						'55'
					);

					//change color
					cy.getByDataTest('box-shadow-color-control').click();
				});

				cy.get('.blockera-component-popover').last().as('color-picker');
				cy.get('@color-picker').within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('2cf1dd');
				});
				cy.getByDataTest('box-shadow-color-control').contains(
					'#2cf1dd'
				);

				//check repeater item value
				cy.get('@repeater-item').within(() => {
					cy.contains('Inner');
					cy.contains('40');
					cy.contains('60');
					cy.contains('15');
					cy.contains('55');
					cy.get('.blockera-component-color-indicator').should(
						'have.attr',
						'style',
						'background: rgb(44, 241, 221);'
					);
				});

				//Check data provider value
				cy.get('body').then(() => {
					expect({
						'inner-0': {
							type: 'inner',
							x: '40px',
							y: '60px',
							order: 0,
							blur: '15px',
							spread: '55px',
							color: '#2cf1dd',
							isVisible: true,
						},
					}).to.be.deep.equal(getControlValue(name, STORE_NAME));
				});
			});
		});
	}
);
