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
	type: 'custom',
	options: selectOptions,
	value: 'all',
	customMenuPosition: 'bottom',
	defaultValue: '',
};
describe('custom select control component testing', () => {
	describe('test logic :(on normal version)', () => {
		it('render correctly', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
			});
		});
		it('select border option', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
				value: 'all',
			});
			cy.get('#downshift-1-toggle-button').click();
			cy.get('#downshift-1-menu').contains('Border').click();
			cy.get('#downshift-1-toggle-button').contains('Border');
		});
		it('not able to select disabled option', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
				value: 'all',
			});
			cy.get('#downshift-8-toggle-button').click();
			cy.get('#downshift-8-menu')
				.contains('Filter (Disabled)')
				.should('have.css', 'pointer-events')
				.should('contain', 'none');
		});
		it('pass defaultValue', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						value=""
						defaultValue="border"
					/>
				),
				value: '',
			});
			cy.get('#downshift-12-toggle-button').contains('Border');
		});
	});
	describe('test custom styles :', () => {
		// const doesHaveClass = (id,class ) => {
		// 	return
		// }

		it('With Field', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} label="Field" />,
				value: 'all',
			});
			cy.contains('Field');
		});
		it('hover', () => {
			cy.withDataProvider({
				component: (
					<SelectControl {...defaultProps} className="is-hovered" />
				),
				value: 'all',
			});
			cy.get('#downshift-14-toggle-button')
				.trigger('mouseover')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'is-hovered');
		});
		it('focus', () => {
			cy.withDataProvider({
				component: (
					<SelectControl {...defaultProps} className="is-focused" />
				),
				value: 'all',
			});
			cy.get('#downshift-15-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'is-focused');
		});

		it('no border : passing false (default)', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} noBorder={false} />,
				value: 'all',
			});
			cy.get('#downshift-16-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('not.have.class', 'no-border');
		});
		it('no border : passing true', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} noBorder={true} />,
				value: 'all',
			});
			cy.get('#downshift-17-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'no-border');
		});

		it('no-border ,focus', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						noBorder={true}
						className="is-focused"
					/>
				),
				value: 'all',
			});
			cy.get('#downshift-18-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'no-border is-focused');
		});

		it('menu position top : passing top (bottom is default)', () => {
			cy.withDataProvider({
				component: (
					<SelectControl {...defaultProps} customMenuPosition="top" />
				),
				value: 'all',
			});
			cy.get('#downshift-19-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'menu-position-top');
		});
		it('customHideInputIcon : passing false', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						customHideInputIcon={false}
					/>
				),
				value: 'all',
			});
			cy.get('#downshift-20-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('not.have.class', 'input-hide-icon');
		});
		it('customHideInputIcon : passing true', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						customHideInputIcon={true}
					/>
				),
				value: 'all',
			});
			cy.get('#downshift-21-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'input-hide-icon');
		});
		it('customHideInputLabel : passing false', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						customHideInputLabel={false}
					/>
				),
				value: 'all',
			});
			cy.get('#downshift-22-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('not.have.class', 'input-hide-label');
		});
		it('customHideInputLabel : passing true', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						customHideInputLabel={true}
					/>
				),
				value: 'all',
			});
			cy.get('#downshift-23-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'input-hide-label');
		});
		it('customHideInputCaret : passing false', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						customHideInputCaret={false}
					/>
				),
				value: 'all',
			});
			cy.get('#downshift-24-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('not.have.class', 'input-hide-caret');
		});
		it('customHideInputCaret : passing true', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						customHideInputCaret={true}
					/>
				),
				value: 'all',
			});
			cy.get('#downshift-25-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'input-hide-caret');
		});
		it('customInputCenterContent : passing false', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						customInputCenterContent={false}
					/>
				),
				value: 'all',
			});
			cy.get('#downshift-26-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('not.have.class', 'input-align-center');
		});
		it('customInputCenterContent : passing true', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						customInputCenterContent={true}
					/>
				),
				value: 'all',
			});
			cy.get('#downshift-27-toggle-button')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'input-align-center');
		});
	});
});
