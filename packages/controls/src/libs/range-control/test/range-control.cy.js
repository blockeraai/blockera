import RangeControl from '..';
import { getControlValue } from '../../../store/selectors';
import { nanoid } from 'nanoid';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';

describe('range-control component testing', () => {
	const name = 'range-control';
	const defaultProps = {
		withInputField: true,
		field: 'range',
	};
	it('render correctly', () => {
		cy.withDataProvider({
			component: <RangeControl {...defaultProps} />,
			value: 0,
			name,
		});
		cy.getByDataTest('range-control').should('exist');
	});

	describe('interaction test :', () => {
		it('change value by typing', () => {
			cy.withDataProvider({
				component: <RangeControl {...defaultProps} />,
				value: 0,
				name,
			});

			cy.get('input').last().clear().type(10);
			cy.getByDataTest('range-control')
				.next()
				.next()
				.should('have.attr', 'style')
				.should('include', 'width: 10%');

			//Check data provider value
			cy.wait(100).then(() => {
				expect(10).to.be.equal(getControlValue(name));
			});
		});

		it('change value by dragging', () => {
			cy.withDataProvider({
				component: <RangeControl {...defaultProps} />,
				value: 0,
				name,
			});
		});

		it('does onChange fire?', () => {
			const defaultProps = {
				withInputField: true,
				field: 'range',
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
				component: <RangeControl {...defaultProps} />,
				value: 0,
				name,
			});

			cy.get('input').last().type(35);

			cy.get('@onChange').should('have.been.called');
		});
	});

	describe('visual test :', () => {
		it('with label', () => {
			cy.withDataProvider({
				component: (
					<RangeControl {...defaultProps} label="Range Control" />
				),
				value: 0,
				name,
			});

			cy.contains('Range Control');
		});

		it('without input field', () => {
			cy.withDataProvider({
				component: (
					<RangeControl {...defaultProps} withInputField={false} />
				),
				value: 0,
				name,
			});

			cy.get('input').should('have.length', '1');
		});

		it('with input field(default)', () => {
			cy.withDataProvider({
				component: (
					<RangeControl {...defaultProps} withInputField={true} />
				),
				value: 0,
				name,
			});

			cy.get('input').should('have.length', '2');
		});
	});

	describe('test useControlContext :', () => {
		it(' have default value, no value, no id', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<RangeControl
						{...defaultProps}
						withInputField={true}
						defaultValue={50}
					/>
				),
				name,
			});

			cy.get('input').last().should('have.value', '50');
		});

		it(' have default value, have id, invalid value', () => {
			const name = nanoid();
			const value = [{ data: { value: undefined } }];

			cy.withDataProvider({
				component: (
					<RangeControl
						{...defaultProps}
						withInputField={true}
						defaultValue={80}
						id={value[0].data.value}
					/>
				),
				name,
			});

			cy.get('input').last().should('have.value', '80');
		});

		it(' have default value, have invalid id,no value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<RangeControl
						{...defaultProps}
						withInputField={true}
						defaultValue={70}
						id="invalid"
					/>
				),
				name,
			});

			cy.get('input').last().should('have.value', '70');
		});

		it(' no default value, no id, have value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<RangeControl {...defaultProps} withInputField={true} />
				),
				value: 60,
				name,
			});

			cy.get('input').last().should('have.value', '60');
		});
	});
});
