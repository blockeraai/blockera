import { SelectControl } from '../..';
import InheritIcon from '../stories/icons/inherit';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
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
const defaultProps = {
	type: 'custom',
	options: selectOptions,
	customMenuPosition: 'bottom',
};

const getSelectButton = () => cy.get('[aria-haspopup="listbox"]');

describe('custom select control component testing', () => {
	describe('interaction test :(on normal version)', () => {
		it('render correctly', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
			});
		});

		it('select border option', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
				value: 'all',
				name,
			});

			getSelectButton().click();
			cy.get('ul').get('li').contains('Border').click();

			getSelectButton().contains('Border');

			// Check data provider value
			getSelectButton().then(() => {
				expect('border').to.be.equal(getControlValue(name));
			});
		});

		it('not able to select disabled option', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
				value: 'all',
				name,
			});

			getSelectButton().click();
			cy.get('ul')
				.get('li')
				.contains('Filter (Disabled)')
				.should('have.css', 'pointer-events')
				.should('contain', 'none');

			//Check data provider value
			getSelectButton().then(() => {
				expect('all').to.be.equal(getControlValue(name));
			});
		});
	});

	describe('visual test:', () => {
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
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

			getSelectButton()
				.parent()
				.parent()
				.parent()
				.should('have.class', 'input-align-center');
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

			getSelectButton().click();
			cy.get('ul').get('li').contains('Border').click();

			cy.get('@onChange').should('have.been.called');
		});
	});

	describe('test useControlContext', () => {
		it('have default value, no value, no id', () => {
			cy.withDataProvider({
				component: (
					<SelectControl {...defaultProps} defaultValue={'all'} />
				),
			});

			getSelectButton().contains('All Properties');
		});

		it('have default value, have id, invalid value', () => {
			const value = [{ id: undefined }];
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						defaultValue={'all'}
						id={value[0].id}
					/>
				),
			});

			getSelectButton().contains('All Properties');
		});

		it('have default value, have invalid id,no value', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						defaultValue={'all'}
						id="invalid"
					/>
				),
			});
			getSelectButton().contains('All Properties');
		});

		it('no default value, no id, have value', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
				value: 'all',
			});

			getSelectButton().contains('All Properties');
		});
	});
});
