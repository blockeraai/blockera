import RangeControl from '..';
import { getControlValue } from '../../../store/selectors';
import { nanoid } from 'nanoid';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';

describe('range-control component testing', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	const name = 'range-control';
	const defaultProps = {
		withInputField: true,
		field: 'range',
	};

	it('should render correctly', () => {
		cy.withDataProvider({
			component: <RangeControl {...defaultProps} />,
			value: 0,
			name,
		});
		cy.getByDataTest('range-control').should('exist');
	});

	it('should render correctly with label', () => {
		cy.withDataProvider({
			component: <RangeControl {...defaultProps} label="Range Control" />,
			value: 0,
			name,
		});

		cy.contains('Range Control');
	});

	it('should render correctly with input field(default)', () => {
		cy.withDataProvider({
			component: <RangeControl {...defaultProps} withInputField={true} />,
			value: 0,
			name,
		});

		cy.get('input[type="number"]').should('exist');
	});

	it('should render correctly without input field', () => {
		cy.withDataProvider({
			component: (
				<RangeControl {...defaultProps} withInputField={false} />
			),
			value: 0,
			name,
		});

		cy.get('input[type="number"]').should('not.exist');
	});

	describe('interaction test :', () => {
		it('should value be equal with context when changing by type', () => {
			cy.withDataProvider({
				component: <RangeControl {...defaultProps} />,
				value: 0,
				name,
			});

			cy.get('input[type="number"]').clear();
			cy.get('input[type="number"]').type(10);

			cy.getByDataTest('range-control')
				.next()
				.next()
				.should('have.attr', 'style')
				.should('include', 'width: 10%');

			//Check data provider value
			cy.get('body').then(() => {
				expect(10).to.be.equal(getControlValue(name));
			});
		});

		it('should value be equal with context when changing by drag', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <RangeControl {...defaultProps} />,
				value: 0,
				name,
			});

			cy.get('input[type=range]').setSliderValue(20);

			cy.getByDataTest('range-control').should('have.value', '20');

			//Check data provider value
			cy.get('body').then(() => {
				expect(20).to.be.equal(getControlValue(name));
			});
		});

		it('should onChange fire when interacting with component', () => {
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

			cy.get('input[type="number"]').type(35);

			cy.get('@onChange').should('have.been.called');
		});
	});

	describe('test useControlContext :', () => {
		it('should render defaultValue when: defaultValue OK && id !OK && value is undefined', () => {
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

			cy.get('input[type="number"]').should('have.value', '50');
		});

		it('should render value when: defaultValue OK && id OK && value is OK', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<RangeControl
						{...defaultProps}
						withInputField={true}
						defaultValue={50}
						id="[1]"
					/>
				),
				name,
				value: [25, 20],
			});

			cy.get('input[type="number"]').should('have.value', '20');
		});

		it('should render default value when:defaultValue OK && id is ok, value is invalid', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<RangeControl
						{...defaultProps}
						withInputField={true}
						defaultValue={70}
						id="[0].value"
					/>
				),
				value: [{ value: undefined }],
				name,
			});

			cy.get('input[type="number"]').should('have.value', '70');
		});

		it('should render default value when:defaultValue OK && id is invalid, value ok', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<RangeControl
						{...defaultProps}
						withInputField={true}
						defaultValue={30}
						id="[0].x"
					/>
				),
				value: [{ value: 10 }],
				name,
			});

			cy.get('input[type="number"]').should('have.value', '30');
		});

		it('should render value when:defaultValue !OK && id is !Ok, value ok', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<RangeControl {...defaultProps} withInputField={true} />
				),
				value: '20',
				name,
			});

			cy.get('input[type="number"]').should('have.value', '20');
		});
	});
});
