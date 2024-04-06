import CustomPropertyControl from '..';
import { nanoid } from 'nanoid';
import { STORE_NAME } from '../../repeater-control/store';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';

describe('custom-property-control component testing', () => {
	describe('rendering test', () => {
		it('should render correctly with label', () => {
			cy.withDataProvider({
				component: (
					<CustomPropertyControl label="Custom CSS Property" />
				),
				value: { 0: { name: '', value: '', isVisible: true } },
				store: STORE_NAME,
			});

			cy.contains('Custom CSS Property').should('exist');
		});

		it('should render correctly with empty value', () => {
			cy.withDataProvider({
				component: <CustomPropertyControl />,
				value: [],
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly without value and defaultValue', () => {
			cy.withDataProvider({
				component: <CustomPropertyControl />,
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly with value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <CustomPropertyControl />,
				value: { 0: { name: '', value: '', isVisible: true } },
				store: STORE_NAME,
				name,
			});
			cy.getByDataCy('group-control-header').should('exist');
		});

		it('should render correctly with defaultValue', () => {
			cy.withDataProvider({
				component: (
					<CustomPropertyControl
						defaultValue={{
							0: {
								name: 'padding',
								value: '10px',
								isVisible: true,
							},
						}}
					/>
				),
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should(
				'include.text',
				'padding'
			);
		});

		it('should popover not be open at first rendering, when passing false to isOpen(default)', () => {
			cy.withDataProvider({
				component: (
					<CustomPropertyControl popoverTitle="Custom CSS Property Popover" />
				),
				store: STORE_NAME,
				value: { 0: { name: '', value: '', isOpen: false } },
			});

			cy.contains('Custom CSS Property Popover').should('not.exist');
		});

		it('should popover be open at first rendering, when passing true to isOpen', () => {
			cy.withDataProvider({
				component: (
					<CustomPropertyControl popoverTitle="Custom CSS Property Popover" />
				),
				store: STORE_NAME,
				value: {
					0: { name: '', value: '', isOpen: true },
				},
			});

			cy.contains('Custom CSS Property Popover').should('exist');
		});

		it('should repeater item have is-active class, when passing true to isVisible(default)', () => {
			cy.withDataProvider({
				component: <CustomPropertyControl />,
				store: STORE_NAME,
				value: { 0: { name: '', value: '', isVisible: true } },
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-active');
		});

		it('should repeater item have is-inactive class, when passing false to isVisible', () => {
			cy.withDataProvider({
				component: <CustomPropertyControl />,
				store: STORE_NAME,
				value: { 0: { name: '', value: '', isVisible: false } },
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-inactive');
		});
	});

	describe('interaction test', () => {
		it('should context and local value be updated, when add data', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <CustomPropertyControl />,
				value: { 0: { name: '', value: '', isVisible: true } },
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.getByAriaLabel('CSS Property Name').type('opacity');
				cy.getByAriaLabel('CSS Property Value').type('0.5');
			});

			//Check repeater item
			cy.getByDataCy('group-control-header').should(
				'include.text',
				'opacity'
			);
			cy.getByDataCy('group-control-header').should(
				'include.text',
				'0.5'
			);

			//Check data provide value
			cy.getByDataCy('group-control-header').then(() => {
				expect({
					0: {
						name: 'opacity',
						value: '0.5',
						isVisible: true,
					},
				}).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});

		it('should onChange be called, when interacting', () => {
			const name = nanoid();
			const propsToPass = {
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

			cy.stub(propsToPass, 'onChange').as('onChange');
			cy.withDataProvider({
				component: <CustomPropertyControl {...propsToPass} />,
				value: { 0: { name: '', value: '', isVisible: true } },
				store: STORE_NAME,
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getByDataTest('popover-body').within(() => {
				cy.getByAriaLabel('CSS Property Name').type('opacity');
				cy.getByAriaLabel('CSS Property Value').type('0.5');
			});

			cy.get('@onChange').should('have.been.called');
		});
	});
});
