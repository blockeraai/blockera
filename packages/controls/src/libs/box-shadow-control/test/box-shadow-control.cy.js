import BoxShadowControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';
import { nanoid } from 'nanoid';

describe('box-shadow-control component testing', () => {
	it('should render correctly', () => {
		cy.withDataProvider({
			component: <BoxShadowControl />,
			store: STORE_NAME,
			value: {
				'outer-0': {
					type: 'outer',
					x: '10px',
					y: '10px',
					blur: '10px',
					spread: '10px',
					color: '#cccccc',
					isVisible: true,
				},
			},
		});

		cy.getByDataCy('group-control-header').should('exist');
	});

	it('should render correctly with empty value', () => {
		cy.withDataProvider({
			component: <BoxShadowControl />,
			store: STORE_NAME,
			value: [],
		});

		cy.getByDataCy('group-control-header').should('not.exist');
	});

	it('should render correctly without value and defaultValue', () => {
		cy.withDataProvider({
			component: <BoxShadowControl />,
			store: STORE_NAME,
		});

		cy.getByDataCy('group-control-header').should('not.exist');
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

		cy.getByDataCy('group-control-header').eq(0).contains('Inner');
	});

	it('should render correctly with label', () => {
		cy.withDataProvider({
			component: <BoxShadowControl label={'Box Shadow'} />,
			store: STORE_NAME,
			value: {
				'outer-0': {
					type: 'outer',
					x: '10px',
					y: '10px',
					blur: '10px',
					spread: '10px',
					color: '#cccccc',
					isVisible: true,
				},
			},
		});

		cy.contains('Box Shadow');
	});

	describe('interaction test: ', () => {
		it('should onChange be called when interacting', () => {
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
						color: '#000000ab',
						isVisible: true,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').eq(0).click();
			cy.contains('Box Shadow').as('popover');

			cy.get('@popover').get('button[aria-label="Inner"]').click();

			cy.get('@onChange').should('have.been.called');
		});

		it('should context value have length of 2, when adding one more item', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <BoxShadowControl label={'Box Shadow'} />,
				value: {
					'outer-0': {
						type: 'outer',
						x: '10px',
						y: '10px',
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

			cy.getByDataCy('group-control-header').should('have.length', '2');

			//Check data provider value
			cy.get('body').then(() => {
				expect(2).to.be.equal(
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
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: true,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').eq(0).as('repeater-item');
			cy.get('@repeater-item').click();
			cy.contains('Box Shadow').parent().as('popover');

			//change x
			cy.get('@popover').getByDataTest('box-shadow-x-input').clear();
			cy.get('@popover').getByDataTest('box-shadow-x-input').type(20);
			//change y
			cy.get('@popover').getByDataTest('box-shadow-y-input').clear();
			cy.get('@popover').getByDataTest('box-shadow-y-input').type(40);
			//change blur
			cy.get('@popover').getByDataTest('box-shadow-blur-input').clear();
			cy.get('@popover').getByDataTest('box-shadow-blur-input').type(35);
			//change spread
			cy.get('@popover').getByDataTest('box-shadow-spread-input').clear();
			cy.get('@popover')
				.getByDataTest('box-shadow-spread-input')
				.type(25);
			//change color
			cy.get('@popover')
				.getByDataTest('box-shadow-color-control')
				.click();
			cy.contains('Color Picker').as('color-picker');
			cy.get('@color-picker').get('input[maxlength="9"]').clear();
			cy.get('@color-picker').get('input[maxlength="9"]').type('2cf1dd');

			//Check value
			cy.getByDataTest('box-shadow-x-input').should('have.value', '20');
			cy.getByDataTest('box-shadow-y-input').should('have.value', '40');
			cy.getByDataTest('box-shadow-blur-input').should(
				'have.value',
				'35'
			);
			cy.getByDataTest('box-shadow-spread-input').should(
				'have.value',
				'25'
			);
			cy.getByDataTest('box-shadow-color-control').contains('#2cf1dd');

			//check repeater item value
			cy.get('@repeater-item').contains('Outer');
			cy.get('@repeater-item').contains('20');
			cy.get('@repeater-item').contains('40');
			cy.get('@repeater-item').contains('35');
			cy.get('@repeater-item').contains('25');
			cy.get('@repeater-item')
				.children()
				.first()
				.children()
				.first()
				.children()
				.should('have.attr', 'style', 'background: rgb(44, 241, 221);');

			//Check data provider value
			cy.get('body').then(() => {
				expect({
					'outer-0': {
						type: 'outer',
						x: '20px',
						y: '40px',
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
					'outer-0': {
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: true,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').eq(0).as('repeater-item');
			cy.get('@repeater-item').click();
			cy.contains('Box Shadow').parent().as('popover');

			//change type
			cy.get('@popover').get('button[aria-label="Inner"]').click();
			//change x
			cy.get('@popover').getByDataTest('box-shadow-x-input').clear();
			cy.get('@popover').getByDataTest('box-shadow-x-input').type(40);
			//change y
			cy.get('@popover').getByDataTest('box-shadow-y-input').clear();
			cy.get('@popover').getByDataTest('box-shadow-y-input').type(60);
			//change blur
			cy.get('@popover').getByDataTest('box-shadow-blur-input').clear();
			cy.get('@popover').getByDataTest('box-shadow-blur-input').type(15);
			//change spread
			cy.get('@popover').getByDataTest('box-shadow-spread-input').clear();
			cy.get('@popover')
				.getByDataTest('box-shadow-spread-input')
				.type(55);
			//change color
			cy.get('@popover')
				.getByDataTest('box-shadow-color-control')
				.click();
			cy.contains('Color Picker').as('color-picker');
			cy.get('@color-picker').get('input[maxlength="9"]').clear();
			cy.get('@color-picker').get('input[maxlength="9"]').type('2cf1dd');

			//Check value
			cy.getByDataTest('box-shadow-x-input').should('have.value', '40');
			cy.getByDataTest('box-shadow-y-input').should('have.value', '60');
			cy.getByDataTest('box-shadow-blur-input').should(
				'have.value',
				'15'
			);
			cy.getByDataTest('box-shadow-spread-input').should(
				'have.value',
				'55'
			);
			cy.getByDataTest('box-shadow-color-control').contains('#2cf1dd');

			//check repeater item value
			cy.get('@repeater-item').contains('Inner');
			cy.get('@repeater-item').contains('40');
			cy.get('@repeater-item').contains('60');
			cy.get('@repeater-item').contains('15');
			cy.get('@repeater-item').contains('55');
			cy.get('@repeater-item')
				.children()
				.first()
				.children()
				.first()
				.children()
				.should('have.attr', 'style', 'background: rgb(44, 241, 221);');

			//Check data provider value
			cy.get('body').then(() => {
				expect({
					'inner-0': {
						type: 'inner',
						x: '40px',
						y: '60px',
						blur: '15px',
						spread: '55px',
						color: '#2cf1dd',
						isOpen: true,
						isVisible: true,
						isOpen: true,
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});
	});

	describe('pass isOpen', () => {
		it('should popover not be open at first rendering, when passing false (default)', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <BoxShadowControl popoverTitle="Box Shadow" />,
				value: {
					'outer-0': {
						type: 'outer',
						x: '0px',
						y: '0px',
						blur: '0px',
						spread: '0px',
						color: '#000000ab',
						isVisible: true,
						isOpen: false,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.contains('Box Shadow').should('not.exist');
		});

		it('should popover be open at first rendering, when passing true', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <BoxShadowControl popoverTitle="Box Shadow" />,
				value: {
					'outer-0': {
						type: 'outer',
						x: '0px',
						y: '0px',
						blur: '0px',
						spread: '0px',
						color: '#000000ab',
						isVisible: true,
						isOpen: true,
					},
				},
				store: STORE_NAME,
				name,
			});

			cy.contains('Box Shadow').should('exist');
		});
	});

	describe('pass isVisible', () => {
		it('should repeater item be visible, when passing true (default)', () => {
			cy.withDataProvider({
				component: <BoxShadowControl />,
				store: STORE_NAME,
				value: {
					'outer-0': {
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
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
				component: <BoxShadowControl />,
				store: STORE_NAME,
				value: {
					'outer-0': {
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
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
