import { SelectControl } from '../..';
import InheritIcon from '../stories/icons/inherit';

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
const defaultProps = {
	type: 'native',
	options: selectOptions,
	value: 'all',
};

describe('native select control component testing', () => {
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
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
				value: 'all',
			});
			cy.get('#inspector-select-control-1').select('opacity');
			cy.get('#inspector-select-control-1').should(
				'have.value',
				'opacity'
			);
			cy.get('#inspector-select-control-1').blur();
		});

		it('not able to select disabled option', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
				value: 'all',
			});
			cy.get('#inspector-select-control-2')
				.get('[value="filter"]')
				.should('be.disabled');
			cy.get('#inspector-select-control-2')
				.get('[value="filter"]')
				.click({ force: true });
			cy.get('#inspector-select-control-2').should('have.value', 'all');
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
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} multiple={true} />,
				value: 'all',
			});
			cy.get('#inspector-select-control-9')
				.select(['opacity', 'margin', 'padding'])
				.invoke('val')
				.should('deep.equal', ['opacity', 'margin', 'padding']);
		});
	});
});
