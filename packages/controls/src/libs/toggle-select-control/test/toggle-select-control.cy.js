import ToggleSelectControl from '../index';
import { __ } from '@wordpress/i18n';
import { default as InheritIcon } from '../stories/icons/inherit';
import { getControlValue } from '../../../store/selectors';

describe('toggle-select-control', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	const name = 'toggle-select-control';

	context('Functionality test → Initialise', () => {
		const options = [
			{
				label: __('Left', 'blockera'),
				value: 'left',
			},
			{
				label: __('Center', 'blockera'),
				value: 'center',
			},
			{
				label: __('Right', 'blockera'),
				value: 'right',
			},
		];

		it('renders options with correct text', () => {
			cy.withDataProvider({
				component: <ToggleSelectControl options={options} />,
				value: 'left',
			});

			cy.get('button')
				.should('length', options.length)
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

		context('Icon Toggle', () => {
			const optionsWithIcon = [
				{
					label: __('Left', 'blockera'),
					value: 'left',
					icon: <InheritIcon />,
				},
				{
					label: __('Center', 'blockera'),
					value: 'center',
					icon: <InheritIcon />,
				},
				{
					label: __('Right', 'blockera'),
					value: 'right',
					icon: <InheritIcon />,
				},
			];

			it('renders options with correct Icon', () => {
				cy.withDataProvider({
					component: (
						<ToggleSelectControl options={optionsWithIcon} />
					),
					value: 'left',
				});

				cy.get('svg').should('have.length', 3);
				cy.get('svg').each(($icon) => {
					cy.wrap($icon).should('exist');
				});
			});

			it('has correct default selected option', () => {
				optionsWithIcon.forEach(
					(optionWithIcon, _, optionsWithIcon) => {
						cy.withDataProvider({
							component: (
								<ToggleSelectControl
									options={optionsWithIcon}
								/>
							),
							value: optionWithIcon.value,
						});

						cy.get('[aria-checked="true"]').should(
							'have.length',
							1
						);
						cy.get('[aria-checked="true"]').should(
							'have.attr',
							'data-value',
							optionWithIcon.value
						);
					}
				);
			});
		});
	});

	context('Functionality Tests', () => {
		const options = [
			{
				label: __('Left', 'blockera'),
				value: 'left',
			},
			{
				label: __('Center', 'blockera'),
				value: 'center',
			},
			{
				label: __('Right', 'blockera'),
				value: 'right',
			},
		];

		it('selects each item correctly', () => {
			cy.withDataProvider({
				component: <ToggleSelectControl options={options} />,
				value: 'left',
				name,
			});

			cy.get('button').each(($btn) => {
				cy.wrap($btn).click();
				// visual and data assertion
				cy.wrap($btn)
					.should('have.attr', 'aria-checked', 'true')
					.then(() => {
						expect(getControlValue(name)).to.be.equal(
							$btn.text().toLowerCase()
						);
					});
			});
		});

		it('only one option can be selected at particular time', () => {
			cy.withDataProvider({
				component: <ToggleSelectControl options={options} />,
				value: 'left',
				name,
			});

			cy.get('button').each(($btn) => {
				cy.wrap($btn).click();
				// visual and data assertion
				cy.get('[aria-checked="true"]')
					.should('have.length', 1)
					.then(() => {
						expect(getControlValue(name)).to.be.equal(
							$btn.text().toLowerCase()
						);
					});
			});
		});

		it('should be able to de-select options when isDeselectable is true', () => {
			cy.withDataProvider({
				component: (
					<ToggleSelectControl
						options={options}
						isDeselectable={true}
					/>
				),
				value: '',
				name,
			});

			cy.get('button').each(($btn) => {
				cy.wrap($btn).click();
				// visual and data assertion : select
				cy.get('[aria-pressed="true"]').then(() => {
					expect(getControlValue(name)).to.be.equal(
						$btn.text().toLowerCase()
					);
				});

				cy.wrap($btn).click();
				// visual and data assertion : de-select
				cy.get('[aria-pressed="true"]')
					.should('not.exist')
					.then(() => {
						expect(getControlValue(name)).to.be.equal(undefined);
					});
			});
		});
	});

	context("Control's initial value", () => {
		const options = [
			{
				label: __('Left', 'blockera'),
				value: 'left',
			},
			{
				label: __('Center', 'blockera'),
				value: 'center',
			},
			{
				label: __('Right', 'blockera'),
				value: 'right',
			},
		];

		// 1.
		it('retrieved data must be defaultValue, when defaultValue(ok) && id(!ok) value(undefined)', () => {
			cy.withDataProvider({
				component: (
					<ToggleSelectControl
						options={options}
						defaultValue="center"
						id="y.x"
					/>
				),
				value: undefined,
				name,
			});

			cy.get('[aria-checked="true"]')
				.should('have.length', '1')
				.contains('Center');
		});

		// 2.
		it('retrieved data must be defaultValue, when defaultValue(ok) && id(!ok) && value(ok)', () => {
			cy.withDataProvider({
				component: (
					<ToggleSelectControl
						options={options}
						defaultValue="center"
						id="x.y"
					/>
				),
				value: 'left',
				name,
			});

			cy.get('[aria-checked="true"]')
				.should('have.length', '1')
				.contains('Center');
		});

		// 3.
		it('retrieved data must be defaultValue, when defaultValue(ok) && id(ok) && value(undefined)', () => {
			cy.withDataProvider({
				component: (
					<ToggleSelectControl
						options={options}
						id="x[0].b[0].c"
						defaultValue="center"
					/>
				),
				value: {
					x: [
						{
							b: [
								{
									c: undefined,
								},
							],
						},
					],
				},
			});

			cy.get('[aria-checked="true"]')
				.should('have.length', '1')
				.contains('Center');
		});

		// 4.
		it('retrieved data must be value, when id(!ok), defaultValue(!ok), value(root)', () => {
			cy.withDataProvider({
				component: <ToggleSelectControl options={options} />,
				value: 'right',
			});

			cy.get('[aria-checked="true"]')
				.should('have.length', '1')
				.contains('Right');
		});
	});
});
