import { SelectControl } from '../..';
import InheritIcon from '../stories/icons/inherit';
import { select, dispatch } from '@wordpress/data';
import { addControl, modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';
import { nanoid } from 'nanoid';

const selectOptions = [
	{
		label: 'All Properties',
		value: 'all',
		icon: <InheritIcon />,
	},
	{
		type: 'optgroup',
		label: 'Common Transitions',
		options: [
			{
				label: 'Opacity',
				value: 'opacity',
				icon: <InheritIcon />,
			},
			{
				label: 'Margin',
				value: 'margin',
				icon: <InheritIcon />,
			},
			{
				label: 'Padding',
				value: 'padding',
				icon: <InheritIcon />,
			},
			{
				label: 'Border',
				value: 'border',
				icon: <InheritIcon />,
			},
			{
				label: 'Transform',
				value: 'transform',
				icon: <InheritIcon />,
			},
			{
				label: 'Flex',
				value: 'flex',
				icon: <InheritIcon />,
			},
			{
				label: 'Filter (Disabled)',
				value: 'filter',
				icon: <InheritIcon />,
				disabled: true,
			},
		],
	},
	{
		label: 'Other',
		value: 'other',
		icon: <InheritIcon />,
	},
];

describe('native select control component testing', () => {
	const defaultProps = {
		type: 'native',
		options: selectOptions,
		value: 'all',
	};

	describe('Normal', () => {
		it('render component correctly ', () => {
			cy.withDataProvider({
				component: (
					<SelectControl {...defaultProps} label={'Select Control'} />
				),
				value: 'all',
			});

			cy.contains('Select Control');
		});

		it('select opacity option', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						onChange={(value) => {
							controlReducer(
								select('publisher-core/controls').getControl(
									name
								),
								modifyControlValue({
									value,
									controlId: name,
								})
							);
						}}
					/>
				),
				value: 'all',
				name,
			});

			cy.get('#inspector-select-control-1').select('opacity');
			cy.get('#inspector-select-control-1').should(
				'have.value',
				'opacity'
			);
			cy.get('#inspector-select-control-1').blur();

			//Check data provider value
			cy.wait(100).then(() => {
				expect('opacity').to.be.equal(getControlValue(name));
			});
		});

		it('not able to select disabled option', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						onChange={(value) => {
							controlReducer(
								select('publisher-core/controls').getControl(
									name
								),
								modifyControlValue({
									value,
									controlId: name,
								})
							);
						}}
					/>
				),
				value: 'all',
				name,
			});

			cy.get('#inspector-select-control-2')
				.get('[value="filter"]')
				.should('be.disabled');
			cy.get('#inspector-select-control-2')
				.get('[value="filter"]')
				.click({ force: true });
			cy.get('#inspector-select-control-2').should('have.value', 'all');

			//Check data provider value
			cy.wait(100).then(() => {
				expect('all').to.be.equal(getControlValue(name));
			});
		});
	});

	describe('Hover', () => {
		it('test border on hover', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						label={'Select Control'}
						className="is-hovered"
					/>
				),
				value: 'all',
			});
			cy.get('#inspector-select-control-3')
				.trigger('mouseover')
				.parent()
				.parent()
				.should('have.class', 'is-hovered');
		});
	});
	describe('Focus', () => {
		it('test border on focus', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						label={'Select Control'}
						className="is-focused"
					/>
				),
				value: 'all',
			});
			cy.get('#inspector-select-control-4')
				.trigger('focus')
				.parent()
				.parent()
				.should('have.class', 'is-focused');
		});
	});
	describe('With Field', () => {
		it('pass label', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} label={'Field'} />,
				value: 'all',
			});
			cy.contains('Field');
		});
	});
	describe('test noBorder :', () => {
		it('passing false ', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} noBorder={false} />,
				value: 'all',
			});
			cy.get('#inspector-select-control-6')
				.parent()
				.parent()
				.should('not.have.class', 'no-border');
		});
		it('passing true ', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} noBorder={true} />,
				value: 'all',
			});
			cy.get('#inspector-select-control-7')
				.parent()
				.parent()
				.should('have.class', 'no-border');
		});
	});
	describe('test multiple :', () => {
		it('passing false ', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} multiple={false} />,
				value: 'all',
			});
			cy.get('#inspector-select-control-8').should(
				'not.have.attr',
				'multiple'
			);
		});

		it('passing true ', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						multiple={true}
						onChange={(value) => {
							controlReducer(
								select('publisher-core/controls').getControl(
									name
								),
								modifyControlValue({
									value,
									controlId: name,
								})
							);
						}}
					/>
				),
				value: 'all',
				name,
			});

			cy.get('#inspector-select-control-9')
				.select(['opacity', 'margin', 'padding'])
				.invoke('val')
				.should('deep.equal', ['opacity', 'margin', 'padding']);

			//Check data provider value
			cy.wait(100).then(() => {
				expect(['opacity', 'margin', 'padding']).to.be.deep.equal(
					getControlValue(name)
				);
			});
		});
	});
	describe('test onChange', () => {
		it('does onChange fire', () => {
			const name = nanoid();
			const propsToPass = {
				...defaultProps,
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
				component: <SelectControl {...propsToPass} />,
				value: 'all',
				name,
			});

			cy.get('#inspector-select-control-10').select('border');

			cy.get('@onChange').should('have.been.called');
		});
	});
});
