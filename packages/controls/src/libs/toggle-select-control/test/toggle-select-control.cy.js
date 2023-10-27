import ToggleSelectControl from '../index';
import { __ } from '@wordpress/i18n';
import { default as InheritIcon } from '../stories/icons/inherit';
import { select, dispatch } from '@wordpress/data';
import { addControl, modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';

describe('toggle-select-control', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	const name = 'toggle-select-control';

	context('Visual Tests', () => {
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

	context('Behavioral Tests', () => {
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
				component: (
					<ToggleSelectControl
						options={options}
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
				value: 'left',
				name,
			});

			cy.get('button').each(($btn) => {
				cy.wrap($btn).click();
				cy.wrap($btn).should('have.attr', 'aria-checked', 'true');
				cy.wait(100).then(() => {
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
			});

			cy.get('button').each(($btn) => {
				cy.wrap($btn).click();
				cy.get('[aria-checked="true"]').should('have.length', 1);
			});
		});

		it('should be able to de-select options when isDeselectable is true', () => {
			cy.withDataProvider({
				component: (
					<ToggleSelectControl
						options={options}
						isDeselectable={true}
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
				value: '',
				name,
			});

			cy.get('button').each(($btn, idx) => {
				cy.wrap($btn).click();
				cy.get('[aria-pressed="true"]').should('exist');
				cy.wait(100).then(() => {
					expect(getControlValue(name)).to.be.equal(
						$btn.text().toLowerCase()
					);
				});

				cy.wrap($btn).click();
				cy.get('[aria-pressed="true"]').should('not.exist');
				cy.wait(100).then(() => {
					expect(getControlValue(name)).to.be.equal(undefined);
				});
			});
		});
	});

	context('useControlContext', () => {
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

		it('should retrieve data from useControlContext with simple value without id', () => {
			cy.withDataProvider({
				component: <ToggleSelectControl options={options} />,
				value: 'center',
			});

			cy.get('[aria-checked="true"]')
				.should('have.length', '1')
				.contains('Center');
		});

		it('should retrieve data from useControlContext with simple value without id', () => {
			cy.withDataProvider({
				component: (
					<ToggleSelectControl
						options={options}
						defaultValue="center"
					/>
				),
				value: undefined,
			});

			cy.get('[aria-checked="true"]')
				.should('have.length', '1')
				.contains('Center');
		});

		// it.only('should retrieve data from useControlContext with complex value with id', () => {
		// 	cy.withDataProvider({
		// 		component: (
		// 			<ToggleSelectControl
		// 				options={options}
		// 				id="x[0].b[0].c"
		// 				defaultValue="center"
		// 			/>
		// 		),
		// 		value: {
		// 			x: [
		// 				{
		// 					b: [
		// 						{
		// 							c: undefined,
		// 						},
		// 					],
		// 				},
		// 			],
		// 		},
		// 	});
		// 	cy.get('[aria-checked="true"]')
		// 		.should('have.length', '1')
		// 		.contains('Center');
		// });
	});
});
