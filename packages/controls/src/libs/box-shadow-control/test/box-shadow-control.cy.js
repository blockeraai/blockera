import BoxShadowControl from '../index';
import { STORE_NAME } from '../../repeater-control/store';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';
import { nanoid } from 'nanoid';

describe('box-shadow-control component testing', () => {
	it('render correctly', () => {
		cy.withDataProvider({
			component: <BoxShadowControl />,
			store: STORE_NAME,
			value: [
				{
					type: 'outer',
					x: '10px',
					y: '10px',
					blur: '10px',
					spread: '10px',
					color: '#cccccc',
					isVisible: true,
				},
			],
		});

		cy.getByDataCy('group-control-header').should('exist');
	});

	it('render correctly with empty value', () => {
		cy.withDataProvider({
			component: <BoxShadowControl />,
			store: STORE_NAME,
			value: [],
		});

		cy.getByDataCy('group-control-header').should('not.exist');
	});

	it('render correctly with no value and defaultValue', () => {
		cy.withDataProvider({
			component: <BoxShadowControl />,
			store: STORE_NAME,
		});

		cy.getByDataCy('group-control-header').should('not.exist');
	});

	it('render correctly with defaultValue', () => {
		cy.withDataProvider({
			component: (
				<BoxShadowControl
					defaultValue={[
						{
							type: 'inner',
							x: '5px',
							y: '5px',
							blur: '5px',
							spread: '5px',
							color: '#cccccc',
							isVisible: true,
						},
					]}
				/>
			),
			store: STORE_NAME,
		});

		cy.getByDataCy('group-control-header').eq(0).contains('Inner');
	});

	it('render correctly with label', () => {
		cy.withDataProvider({
			component: <BoxShadowControl label={'Box Shadow'} />,
			store: STORE_NAME,
			value: [
				{
					type: 'outer',
					x: '10px',
					y: '10px',
					blur: '10px',
					spread: '10px',
					color: '#cccccc',
					isVisible: true,
				},
			],
		});

		cy.contains('Box Shadow');
	});

	it('does onChange fire?', () => {
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
				<BoxShadowControl popoverLabel="Box Shadow" {...defaultProps} />
			),
			value: [
				{
					type: 'outer',
					x: '0px',
					y: '0px',
					blur: '0px',
					spread: '0px',
					color: '#000000ab',
					isVisible: true,
				},
			],
			store: STORE_NAME,
			name,
		});

		cy.getByDataCy('group-control-header').eq(0).click();
		cy.contains('Box Shadow').as('popover');

		cy.get('@popover').get('button[aria-label="Inner"]').click();

		cy.get('@onChange').should('have.been.called');
	});

	describe('interaction test: ', () => {
		it('add one more item', () => {
			const name = nanoid();
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <BoxShadowControl label={'Box Shadow'} />,
				value: [
					{
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: true,
					},
				],
				store: STORE_NAME,
				name,
			});

			cy.get('button[aria-label="Add New Box Shadow"]').click();

			cy.getByDataCy('group-control-header').should('have.length', '2');

			//Check data provider value
			cy.get('body').then(() => {
				expect(2).to.be.equal(getControlValue(name, STORE_NAME).length);
			});
		});

		it('change data (type:outer)', () => {
			const name = nanoid();
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <BoxShadowControl popoverLabel={'Box Shadow'} />,
				value: [
					{
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: true,
					},
				],
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
				expect([
					{
						type: 'outer',
						x: '20px',
						y: '40px',
						blur: '35px',
						spread: '25px',
						color: '#2cf1dd',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('change type and data ', () => {
			const name = nanoid();
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <BoxShadowControl popoverLabel={'Box Shadow'} />,
				value: [
					{
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: true,
					},
				],
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
				expect([
					{
						type: 'inner',
						x: '40px',
						y: '60px',
						blur: '15px',
						spread: '55px',
						color: '#2cf1dd',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});
	});

	describe('pass isOpen', () => {
		it('passing false (default)', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <BoxShadowControl popoverLabel="Box Shadow" />,
				value: [
					{
						type: 'outer',
						x: '0px',
						y: '0px',
						blur: '0px',
						spread: '0px',
						color: '#000000ab',
						isVisible: true,
						isOpen: false,
					},
				],
				store: STORE_NAME,
				name,
			});

			cy.contains('Box Shadow').should('not.exist');
		});

		it('passing true', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <BoxShadowControl popoverLabel="Box Shadow" />,
				value: [
					{
						type: 'outer',
						x: '0px',
						y: '0px',
						blur: '0px',
						spread: '0px',
						color: '#000000ab',
						isVisible: true,
						isOpen: true,
					},
				],
				store: STORE_NAME,
				name,
			});

			cy.contains('Box Shadow').should('exist');
		});
	});

	describe('pass isVisible', () => {
		it('passing true (default)', () => {
			cy.withDataProvider({
				component: <BoxShadowControl />,
				store: STORE_NAME,
				value: [
					{
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: true,
					},
				],
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-active');
		});

		it('passing false', () => {
			cy.withDataProvider({
				component: <BoxShadowControl />,
				store: STORE_NAME,
				value: [
					{
						type: 'outer',
						x: '10px',
						y: '10px',
						blur: '10px',
						spread: '10px',
						color: '#cccccc',
						isVisible: false,
					},
				],
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-inactive');
		});
	});
});
