import OutlineControl from '..';
import { nanoid } from 'nanoid';
import { STORE_NAME } from '../../repeater-control/store';
import { getControlValue } from '../../../store/selectors';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { modifyControlValue } from '../../../store/actions';
import { select } from '@wordpress/data';

describe('outline control component testing', () => {
	context('rendering test', () => {
		it('should render correctly', () => {
			cy.withDataProvider({
				component: <OutlineControl />,
				store: STORE_NAME,
				value: [
					{
						border: {
							width: '5px',
							style: 'solid',
							color: '#000000',
						},
						offset: '2px',
						isVisible: true,
					},
				],
			});

			cy.getByDataCy('publisher-repeater-control').should('exist');
		});

		it('should render correctly with label', () => {
			cy.withDataProvider({
				component: <OutlineControl label="Outline Control" />,
				store: STORE_NAME,
				value: [
					{
						border: {
							width: '5px',
							style: 'solid',
							color: '#000000',
						},
						offset: '2px',
						isVisible: true,
					},
				],
			});

			cy.contains('Outline Control');
		});

		it('should render correctly with empty value', () => {
			cy.withDataProvider({
				component: <OutlineControl />,
				store: STORE_NAME,
				value: [],
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly without value and defaultValue', () => {
			cy.withDataProvider({
				component: <OutlineControl />,
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').should('not.exist');
		});

		it('should render correctly with defaultValue', () => {
			cy.withDataProvider({
				component: (
					<OutlineControl
						defaultValue={[
							{
								border: {
									width: '10px',
									style: 'solid',
									color: '#000000',
								},
								offset: '2px',
								isVisible: true,
							},
						]}
					/>
				),
				store: STORE_NAME,
			});

			cy.getByDataCy('group-control-header').contains('10px');
		});

		it('should popover not be open at first rendering, when passing false to isOpen(default)', () => {
			cy.withDataProvider({
				component: <OutlineControl popoverTitle="Outline Popover" />,
				store: STORE_NAME,
				value: [
					{
						border: {
							width: '5px',
							style: 'solid',
							color: '#000000',
						},
						offset: '2px',
						isVisible: true,
						isOpen: false,
					},
				],
			});

			cy.contains('Outline Popover').should('not.exist');
		});

		it('should popover be open at first rendering, when passing true to isOpen', () => {
			cy.withDataProvider({
				component: <OutlineControl popoverTitle="Outline Popover" />,
				store: STORE_NAME,
				value: [
					{
						border: {
							width: '5px',
							style: 'solid',
							color: '#000000',
						},
						offset: '2px',
						isVisible: true,
						isOpen: true,
					},
				],
			});

			cy.contains('Outline Popover').should('exist');
		});

		it('should repeater item have is-active class, when passing true to isVisible(default)', () => {
			cy.withDataProvider({
				component: <OutlineControl />,
				store: STORE_NAME,
				value: [
					{
						border: {
							width: '5px',
							style: 'solid',
							color: '#000000',
						},
						offset: '2px',
						isVisible: true,
					},
				],
			});

			cy.getByDataCy('group-control-header')
				.parent()
				.parent()
				.should('have.class', 'is-active');
		});
		it('should repeater item have is-inactive class, when passing false to isVisible', () => {
			cy.withDataProvider({
				component: <OutlineControl />,
				store: STORE_NAME,
				value: [
					{
						border: {
							width: '5px',
							style: 'solid',
							color: '#000000',
						},
						offset: '2px',
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

	context('interaction test', () => {
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
				component: <OutlineControl {...defaultProps} />,
				store: STORE_NAME,
				value: [
					{
						border: {
							width: '5px',
							style: 'solid',
							color: '#000000',
						},
						offset: '2px',
						isVisible: true,
					},
				],
				name,
			});

			cy.getByDataCy('group-control-header').click();
			cy.getByDataTest('outline-offset-input').clear();
			cy.getByDataTest('outline-offset-input').type(10);

			cy.get('@onChange').should('have.been.called');
		});

		it('should context and local value be updated,when change data', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <OutlineControl />,
				store: STORE_NAME,
				value: [
					{
						border: {
							width: '5px',
							style: 'solid',
							color: '#000000',
						},
						offset: '2px',
						isVisible: true,
					},
				],
				name,
			});

			cy.getByDataCy('group-control-header').click();

			cy.getByDataTest('border-control-component').within(() => {
				cy.get('input[type="number"]').clear();
				cy.get('input[type="number"]').type(10);
			});

			cy.getByDataTest('border-control-color').click();
			cy.getByDataTest('popover-body')
				.last()
				.within(() => {
					cy.get('input[maxlength="9"]').clear();
					cy.get('input[maxlength="9"]').type('ad2dcc');
				});

			cy.getByDataTest('border-control-color').next().next().click();
			cy.get('ul').get('li').eq(2).click();

			cy.getByDataTest('outline-offset-input').clear();
			cy.getByDataTest('outline-offset-input').type(5);

			//Check values
			cy.getByDataTest('border-control-component').within(() => {
				cy.get('input[type="number"]').should('have.value', '10');
			});

			cy.getByDataTest('border-control-color')
				.should('have.attr', 'style')
				.should('include', '#ad2dcc');

			cy.getByDataTest('border-control-color').next().click();
			cy.get('ul')
				.get('li')
				.eq(2)
				.should('have.attr', 'aria-selected', 'true');

			cy.getByDataTest('outline-offset-input').should('have.value', '5');

			//Check repeater item
			cy.getByDataCy('group-control-header').contains('10px');
			cy.getByDataCy('group-control-header').within(() => {
				cy.get('span')
					.last()
					.should('have.attr', 'style')
					.should('include', 'rgb(173, 45, 204)');
			});

			//Check data provider value
			cy.get('body').then(() => {
				expect([
					{
						border: {
							width: '10px',
							style: 'dotted',
							color: '#ad2dcc',
						},
						offset: '5px',
						isVisible: true,
					},
				]).to.be.deep.equal(getControlValue(name, STORE_NAME));
			});
		});
	});
});
