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

describe('native select control component testing', () => {
	const defaultProps = {
		type: 'native',
		options: selectOptions,
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
				component: <SelectControl {...defaultProps} />,
				value: 'all',
				name,
			});
			cy.get('select').select('opacity');

			cy.get('select').should('have.value', 'opacity');
			cy.get('select').blur();

			//Check data provider value
			cy.get('select').then(() => {
				expect('opacity').to.be.equal(getControlValue(name));
			});
		});

		it('not able to select disabled option', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
				value: 'all',
				name,
			});

			cy.get('select').get('[value="filter"]').should('be.disabled');
			cy.get('select').get('[value="filter"]').click({ force: true });
			cy.get('select').should('have.value', 'all');

			//Check data provider value
			cy.get('select').then(() => {
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
			cy.get('select').trigger('mouseover');
			cy.get('select')
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
			cy.get('select').trigger('focus');
			cy.get('select')
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
			cy.get('select')
				.parent()
				.parent()
				.should('not.have.class', 'no-border');
		});

		it('passing true ', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} noBorder={true} />,
				value: 'all',
			});
			cy.get('select')
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
			cy.get('select').should('not.have.attr', 'multiple');
		});

		it('passing true ', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} multiple={true} />,
				value: 'all',
				name,
			});

			cy.get('select').select(['opacity', 'margin', 'padding']);
			cy.get('select')
				.invoke('val')
				.should('deep.equal', ['opacity', 'margin', 'padding']);

			//Check data provider value
			cy.get('select').then(() => {
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
						select('blockera-core/controls').getControl(name),
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

			cy.get('select').select('border');

			cy.get('@onChange').should('have.been.called');
		});
	});

	describe('test useControlContext', () => {
		it('should render default value when:defaultValue OK && id !OK && value is undefined', () => {
			cy.withDataProvider({
				component: (
					<SelectControl {...defaultProps} defaultValue={'all'} />
				),
			});

			cy.get('select').should('have.value', 'all');
		});

		it('should render value when: defaultValue OK && id OK && value is OK', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						defaultValue={'all'}
						id={'[0]'}
					/>
				),
				value: ['border'],
			});

			cy.get('select').should('have.value', 'border');
		});

		it('should render default value when:defaultValue OK && id is invalid, value ok', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						defaultValue={'all'}
						id={'[1]'}
					/>
				),
				value: ['border'],
			});

			cy.get('select').should('have.value', 'all');
		});

		it('should render default value when:defaultValue OK && id is valid, value is invalid', () => {
			cy.withDataProvider({
				component: (
					<SelectControl
						{...defaultProps}
						defaultValue={'all'}
						id={'[0].data'}
					/>
				),
				value: [{ data: undefined }],
			});

			cy.get('select').should('have.value', 'all');
		});

		it('should render value when:defaultValue !OK && id !OK && value exists on root', () => {
			cy.withDataProvider({
				component: <SelectControl {...defaultProps} />,
				value: 'all',
			});

			cy.get('select').should('have.value', 'all');
		});
	});
});
