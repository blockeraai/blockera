import ToggleSelectControl from '../index';
import { __ } from '@wordpress/i18n';
import { getControlValue } from '../../../store/selectors';

function InheritIcon({}) {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 18 18"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.91426 15.9408C9.61504 15.9799 9.30987 16 9 16C8.69013 16 8.38496 15.9799 8.08573 15.9408L8.30562 14.2551C8.53213 14.2847 8.76385 14.3 9 14.3C9.23615 14.3 9.46787 14.2847 9.69438 14.2551L9.91426 15.9408ZM6.32049 15.4688L6.97168 13.8985C6.54172 13.7202 6.13961 13.4865 5.77437 13.2058L4.73851 14.5538C5.22019 14.9239 5.7514 15.2328 6.32049 15.4688ZM3.4462 13.2615L4.79417 12.2256C4.5135 11.8604 4.27979 11.4583 4.1015 11.0283L2.53116 11.6795C2.76715 12.2486 3.07605 12.7798 3.4462 13.2615ZM2.05917 9.91426L3.74489 9.69438C3.71534 9.46787 3.7 9.23615 3.7 9C3.7 8.76385 3.71534 8.53213 3.74489 8.30562L2.05917 8.08573C2.02013 8.38496 2 8.69013 2 9C2 9.30987 2.02013 9.61504 2.05917 9.91426ZM2.53116 6.32049L4.1015 6.97168C4.27979 6.54172 4.5135 6.13961 4.79417 5.77437L3.4462 4.73851C3.07605 5.22019 2.76715 5.7514 2.53116 6.32049ZM4.73851 3.4462L5.77437 4.79417C6.13961 4.5135 6.54172 4.27979 6.97168 4.1015L6.32049 2.53116C5.7514 2.76715 5.22019 3.07605 4.73851 3.4462ZM8.08574 2.05917C8.38496 2.02013 8.69013 2 9 2C9.30987 2 9.61504 2.02013 9.91427 2.05917L9.69438 3.74489C9.46787 3.71534 9.23615 3.7 9 3.7C8.76385 3.7 8.53213 3.71534 8.30562 3.74489L8.08574 2.05917ZM11.6795 2.53116L11.0283 4.1015C11.4583 4.27979 11.8604 4.5135 12.2256 4.79417L13.2615 3.4462C12.7798 3.07605 12.2486 2.76715 11.6795 2.53116ZM14.5538 4.73851L13.2058 5.77437C13.4865 6.13961 13.7202 6.54172 13.8985 6.97168L15.4688 6.32049C15.2328 5.7514 14.9239 5.22019 14.5538 4.73851ZM15.9408 8.08574L14.2551 8.30562C14.2847 8.53213 14.3 8.76385 14.3 9C14.3 9.23615 14.2847 9.46787 14.2551 9.69438L15.9408 9.91427C15.9799 9.61504 16 9.30987 16 9C16 8.69013 15.9799 8.38496 15.9408 8.08574ZM15.4688 11.6795L13.8985 11.0283C13.7202 11.4583 13.4865 11.8604 13.2058 12.2256L14.5538 13.2615C14.9239 12.7798 15.2328 12.2486 15.4688 11.6795ZM13.2615 14.5538L12.2256 13.2058C11.8604 13.4865 11.4583 13.7202 11.0283 13.8985L11.6795 15.4688C12.2486 15.2328 12.7798 14.9239 13.2615 14.5538Z"
				fill="currentColor"
			/>
		</svg>
	);
}

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
						expect(getControlValue(name)).to.be.equal('');
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

		// 2. Nested `id` with flat scalar saved value: prepare() cannot traverse the path,
		// so the scalar root value wins over defaultValue (legacy / flat storage).
		it('retrieved data must be root value when defaultValue(ok) && id(nested) && value(scalar at root)', () => {
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
				skipSyncValue: false,
			});

			cy.get('[aria-checked="true"]')
				.should('have.length', '1')
				.contains('Left');
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
