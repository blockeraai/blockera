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
			value: [
				{
					type: 'blur',
					blur: '0px',
				},
			],
		});

		cy.getByDataCy('group-control-header').should('exist');
	});

	it('should render correctly with empty value', () => {
		cy.withDataProvider({
			component: <FilterControl />,
			store: STORE_NAME,
			value: [],
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
					defaultValue={[
						{
							type: 'drop-shadow',
							'drop-shadow-x': '10px',
							'drop-shadow-y': '10px',
							'drop-shadow-blur': '10px',
							'drop-shadow-color': '',
						},
					]}
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
				value: [
					{
						type: 'blur',
						blur: '0px',
					},
				],
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
				value: [
					{
						type: 'drop-shadow',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
					},
				],
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
				expect([
					{
						type: 'blur',
						blur: '25px',
						brightness: '200%',
						contrast: '200%',
						'hue-rotate': '45deg',
						saturate: '200%',
						grayscale: '100%',
						invert: '100%',
						sepia: '100%',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should context and local value be updated,when select drop shadow and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: [
					{
						type: 'blur',
						blur: '20px',
					},
				],
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
			cy.getByDataCy('group-control-header').contains('100px 55px 15px');

			//Check data provider value
			cy.get('body').then(() => {
				expect([
					{
						type: 'drop-shadow',
						blur: '20px',
						brightness: '200%',
						contrast: '200%',
						'hue-rotate': '45deg',
						saturate: '200%',
						grayscale: '100%',
						invert: '100%',
						sepia: '100%',
						'drop-shadow-x': '100px',
						'drop-shadow-y': '55px',
						'drop-shadow-blur': '15px',
						'drop-shadow-color': '#2cf1dd',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should context and local value be updated,when select brightness and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: [
					{
						type: 'blur',
						blur: '20px',
					},
				],
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
				expect([
					{
						type: 'brightness',
						blur: '20px',
						brightness: '100%',
						contrast: '200%',
						'hue-rotate': '45deg',
						saturate: '200%',
						grayscale: '100%',
						invert: '100%',
						sepia: '100%',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should context and local value be updated,when select contrast and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: [
					{
						type: 'blur',
						blur: '20px',
					},
				],
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
				expect([
					{
						type: 'contrast',
						blur: '20px',
						brightness: '200%',
						contrast: '80%',
						'hue-rotate': '45deg',
						saturate: '200%',
						grayscale: '100%',
						invert: '100%',
						sepia: '100%',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should context and local value be updated,when select hue-rotate and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: [
					{
						type: 'blur',
						blur: '20px',
					},
				],
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
				expect([
					{
						type: 'hue-rotate',
						blur: '20px',
						brightness: '200%',
						contrast: '200%',
						'hue-rotate': '30deg',
						saturate: '200%',
						grayscale: '100%',
						invert: '100%',
						sepia: '100%',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should context and local value be updated,when select saturate and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: [
					{
						type: 'blur',
						blur: '20px',
					},
				],
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
				expect([
					{
						type: 'saturate',
						blur: '20px',
						brightness: '200%',
						contrast: '200%',
						'hue-rotate': '45deg',
						saturate: '150%',
						grayscale: '100%',
						invert: '100%',
						sepia: '100%',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should context and local value be updated,when select grayscale and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: [
					{
						type: 'blur',
						blur: '20px',
					},
				],
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
				expect([
					{
						type: 'grayscale',
						blur: '20px',
						brightness: '200%',
						contrast: '200%',
						'hue-rotate': '45deg',
						saturate: '200%',
						grayscale: '50%',
						invert: '100%',
						sepia: '100%',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should context and local value be updated,when select invert and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: [
					{
						type: 'blur',
						blur: '20px',
					},
				],
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
				expect([
					{
						type: 'invert',
						blur: '20px',
						brightness: '200%',
						contrast: '200%',
						'hue-rotate': '45deg',
						saturate: '200%',
						grayscale: '100%',
						invert: '70%',
						sepia: '100%',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should context and local value be updated,when select sepia and change value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl />,
				store: STORE_NAME,
				name,
				value: [
					{
						type: 'blur',
						blur: '20px',
					},
				],
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
				expect([
					{
						type: 'sepia',
						blur: '20px',
						brightness: '200%',
						contrast: '200%',
						'hue-rotate': '45deg',
						saturate: '200%',
						grayscale: '100%',
						invert: '100%',
						sepia: '40%',
						'drop-shadow-x': '10px',
						'drop-shadow-y': '10px',
						'drop-shadow-blur': '10px',
						'drop-shadow-color': '',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});
	});

	describe('pass isOpen', () => {
		it('should popover not be open at first rendering, when passing false (default)', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl popoverLabel="Filter Control" />,
				value: [
					{
						type: 'blur',
						blur: '0px',
						isOpen: false,
					},
				],
				store: STORE_NAME,
				name,
			});

			cy.contains('Filter Control').should('not.exist');
		});

		it('should popover be open at first rendering, when passing true', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <FilterControl popoverLabel="Filter Control" />,
				value: [
					{
						type: 'blur',
						blur: '0px',
						isOpen: true,
					},
				],
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
				value: [
					{
						type: 'blur',
						blur: '0px',
						isVisible: true,
					},
				],
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
				value: [
					{
						type: 'blur',
						blur: '0px',
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
