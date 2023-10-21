import ToggleSelectControl from '../index';
import { __ } from '@wordpress/i18n';
import { default as InheritIcon } from '../stories/icons/inherit';

describe('toggle-select-control', () => {
	context('Text Toggle', () => {
		const options = [
			{
				label: __('Left', 'publisher-core'),
				value: 'left',
			},
			{
				label: __('Center', 'publisher-core'),
				value: 'center',
			},
			{
				label: __('Right', 'publisher-core'),
				value: 'right',
			},
		];

		it('renders options with correct text', () => {
			cy.withDataProvider({
				component: <ToggleSelectControl options={options} />,
				value: 'left',
			});

			cy.get('button')
				.should('length', 3)
				.each(($btn, idx) => {
					cy.wrap($btn).should(
						'have.text',
						Cypress._.upperFirst(options[idx].value)
					);
				});
		});

		it('renders with correct default selected text', () => {
			options.forEach((option, _, options) => {
				cy.withDataProvider({
					component: <ToggleSelectControl options={options} />,
					value: option.value,
				});

				cy.get('[aria-checked="true"]').should('have.length', 1);
				cy.get('[aria-checked="true"]').should(
					'have.text',
					Cypress._.upperFirst(option.value)
				);
			});
		});
	});

	context('Icon Toggle', () => {
		const optionsWithIcon = [
			{
				label: __('Left', 'publisher-core'),
				value: 'left',
				icon: <InheritIcon />,
			},
			{
				label: __('Center', 'publisher-core'),
				value: 'center',
				icon: <InheritIcon />,
			},
			{
				label: __('Right', 'publisher-core'),
				value: 'right',
				icon: <InheritIcon />,
			},
		];

		it('renders options with correct Icon', () => {
			cy.withDataProvider({
				component: <ToggleSelectControl options={optionsWithIcon} />,
				value: 'left',
			});

			cy.get('svg').should('have.length', 3);
			cy.get('svg').each(($icon) => {
				cy.wrap($icon).should('exist');
			});
		});

		it('has correct default selected option', () => {
			optionsWithIcon.forEach((optionWithIcon, _, optionsWithIcon) => {
				cy.withDataProvider({
					component: (
						<ToggleSelectControl options={optionsWithIcon} />
					),
					value: optionWithIcon.value,
				});

				cy.get('[aria-checked="true"]').should('have.length', 1);
				cy.get('[aria-checked="true"]').should(
					'have.attr',
					'data-value',
					optionWithIcon.value
				);
			});
		});
	});

	context('Common Tests:(Implemented on Text Toggle)', () => {
		const options = [
			{
				label: __('Left', 'publisher-core'),
				value: 'left',
			},
			{
				label: __('Center', 'publisher-core'),
				value: 'center',
			},
			{
				label: __('Right', 'publisher-core'),
				value: 'right',
			},
		];

		it('selects each item correctly', () => {
			cy.withDataProvider({
				component: <ToggleSelectControl options={options} />,
				value: 'left',
			});

			cy.get('button').each(($btn) => {
				cy.wrap($btn).click();
				cy.wrap($btn).should('have.attr', 'aria-checked', 'true');
			});
		});

		it('only one option can be selected at particular time', () => {
			cy.withDataProvider({
				component: <ToggleSelectControl options={options} />,
				value: 'left',
			});

			cy.get('button').each(($btn) => {
				cy.wrap($btn).click();
				cy.get('[aria-checked="true"]').should('have.length', 1);
			});
		});

		context('isDeselectable=True', () => {
			it('all options should be unselected on default state', () => {
				cy.withDataProvider({
					component: (
						<ToggleSelectControl
							options={options}
							isDeselectable={true}
						/>
					),
					value: '',
				});

				cy.get('[aria-checked="true"]').should('not.exist');
			});

			it('options are de-selectable', () => {
				cy.withDataProvider({
					component: (
						<ToggleSelectControl
							options={options}
							isDeselectable={true}
						/>
					),
					value: '',
				});

				cy.get('button').each(($btn) => {
					cy.wrap($btn).click();
					//Todo : test is passing but aria-pressed must change to aria-checked
					cy.get('[aria-pressed="true"]');
					cy.wrap($btn).click();
					cy.get('[aria-pressed="true"]').should('not.exist');
				});
			});
		});
	});
});
