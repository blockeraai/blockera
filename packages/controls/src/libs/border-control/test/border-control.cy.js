import { BorderControl } from '../../..';
import { select } from '@wordpress/data';
import { modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';

describe('border-control component testing', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	const name = 'border-control';
	const defaultProps = {
		field: 'border',
	};

	describe('interaction test: ', () => {
		it('render correctly', () => {
			cy.withDataProvider({
				component: <BorderControl {...defaultProps} />,
				value: {
					width: '0px',
					style: 'solid',
					color: '',
				},
				name,
			});

			cy.getByDataTest('border-control-component').should('exist');
		});

		it('change width', () => {
			cy.withDataProvider({
				component: <BorderControl {...defaultProps} />,
				value: {
					width: '0px',
					style: 'solid',
					color: '',
				},
				name,
			});

			cy.getByDataTest('border-control-width').clear();
			cy.getByDataTest('border-control-width').type(5);
			cy.getByDataTest('border-control-width').should('have.value', '5');

			// Check data provider value!
			cy.getByDataTest('border-control-width').then(() => {
				expect('5px').to.be.equal(getControlValue(name).width);
			});
		});

		it('dose onChange fire ?', () => {
			const defaultProps = {
				field: 'border',
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
				component: <BorderControl {...defaultProps} />,
				value: {
					width: '0px',
					style: 'solid',
					color: '',
				},
				name,
			});

			cy.getByDataTest('border-control-width').clear();
			cy.getByDataTest('border-control-width').type(10);
			cy.get('@onChange').should('have.been.called');
		});

		it('change style', () => {
			cy.withDataProvider({
				component: <BorderControl {...defaultProps} />,
				value: {
					width: '0px',
					style: 'solid',
					color: '',
				},
				name,
			});

			cy.getByDataTest('border-control-color').next().click();
			cy.get('ul').children('li').last().click();

			cy.getByDataTest('border-control-color').next().click();
			cy.get('ul')
				.children('li')
				.last()
				.should('have.attr', 'aria-selected')
				.should('include', 'true');

			// Check data provider value!
			cy.getByDataTest('border-control-color')
				.next()
				.then(() => {
					expect('double').to.be.equal(getControlValue(name).style);
				});
		});

		describe('color picker :', () => {
			it('change color', () => {
				cy.withDataProvider({
					component: <BorderControl {...defaultProps} />,
					value: {
						width: '0px',
						style: 'solid',
						color: '',
					},
					name,
				});

				cy.getByDataTest('border-control-color').click();
				cy.contains('Color Picker')
					.parent()
					.get('input[maxlength="9"]')
					.clear();
				cy.contains('Color Picker')
					.parent()
					.get('input[maxlength="9"]')
					.type('cccccc');

				cy.getByDataTest('border-control-color')
					.should('have.attr', 'style')
					.should('include', 'cccccc');

				// Check data provider value!
				cy.getByDataTest('border-control-color').then(() => {
					expect('#cccccc').to.be.equal(getControlValue(name).color);
				});
			});

			it('clear color', () => {
				cy.withDataProvider({
					component: <BorderControl {...defaultProps} />,
					value: {
						width: '0px',
						style: 'solid',
						color: '',
					},
					name,
				});

				//Check current color
				cy.getByDataTest('border-control-color')
					.should('have.attr', 'style')
					.should('include', 'ccc');

				//Check data provider value!
				cy.getByDataTest('border-control-color').then(() => {
					expect('#cccccc').to.be.equal(getControlValue(name).color);
				});

				//Clear color
				cy.getByDataTest('border-control-color').click();
				cy.contains('Clear').click();
				cy.getByDataTest('border-control-color')
					.should('have.attr', 'style')
					.should('be.empty');

				// Check data provider value!
				cy.getByDataTest('border-control-color').then(() => {
					expect('').to.be.equal(getControlValue(name).color);
				});
			});
		});
	});

	describe('rendering test', () => {
		it('with field', () => {
			cy.withDataProvider({
				component: (
					<BorderControl {...defaultProps} label="Border Control" />
				),
				value: { width: '0px', style: 'solid', color: '' },
				name,
			});

			cy.contains('Border Control');
		});

		describe('Focus', () => {
			describe('width', () => {
				it('default width style', () => {
					cy.withDataProvider({
						component: (
							<BorderControl
								{...defaultProps}
								__isWidthFocused={true}
							/>
						),
						value: { width: '0px', style: 'solid', color: '' },
						name,
					});

					cy.getByDataTest('border-control-component')
						.children()
						.first()
						.should('have.class', 'is-focused');
				});

				it('passing width style', () => {
					cy.withDataProvider({
						component: (
							<BorderControl
								{...defaultProps}
								__isWidthFocused={true}
								style={{ width: '100px' }}
							/>
						),
						value: { width: '0px', style: 'solid', color: '' },
						name,
					});

					cy.getByDataTest('border-control-component')
						.children()
						.first()
						.should('have.class', 'is-focused');

					cy.getByDataTest('border-control-component')
						.should('have.attr', 'style')
						.should('include', 'width: 100px');
				});
			});

			describe('color', () => {
				it('default width style', () => {
					cy.withDataProvider({
						component: (
							<BorderControl
								{...defaultProps}
								__isColorFocused={true}
							/>
						),
						value: { width: '0px', style: 'solid', color: '' },
						name,
					});

					cy.getByDataTest('border-control-color').should(
						'have.class',
						'is-focused'
					);
				});

				it('passing width style', () => {
					cy.withDataProvider({
						component: (
							<BorderControl
								{...defaultProps}
								__isColorFocused={true}
								style={{ width: '100px' }}
							/>
						),
						value: { width: '0px', style: 'solid', color: '' },
						name,
					});

					cy.getByDataTest('border-control-color').should(
						'have.class',
						'is-focused'
					);

					cy.getByDataTest('border-control-component')
						.should('have.attr', 'style')
						.should('include', 'width: 100px');
				});
			});
			describe('style', () => {
				it('default width style', () => {
					cy.withDataProvider({
						component: (
							<BorderControl
								{...defaultProps}
								__isStyleFocused={true}
							/>
						),
						value: { width: '0px', style: 'solid', color: '' },
						name,
					});

					cy.getByDataTest('border-control-component')
						.children()
						.last()
						.should('have.class', 'is-focused');
				});

				it('passing width style', () => {
					cy.withDataProvider({
						component: (
							<BorderControl
								{...defaultProps}
								__isStyleFocused={true}
								style={{ width: '100px' }}
							/>
						),
						value: { width: '0px', style: 'solid', color: '' },
						name,
					});

					cy.getByDataTest('border-control-component')
						.children()
						.last()
						.should('have.class', 'is-focused');

					cy.getByDataTest('border-control-component')
						.should('have.attr', 'style')
						.should('include', 'width: 100px');
				});
			});
		});
	});

	describe('test useControlContext', () => {
		it('should render default value when:defaultValue OK && id !OK && value is undefined', () => {
			cy.withDataProvider({
				component: (
					<BorderControl
						{...defaultProps}
						defaultValue={{
							width: '10px',
							style: 'solid',
							color: 'ffffff',
						}}
					/>
				),
			});

			cy.getByDataTest('border-control-color')
				.should('have.attr', 'style')
				.should('include', 'ffffff');
			cy.getByDataTest('border-control-width').should('have.value', '10');
		});

		it('should render value when: defaultValue OK && id OK && value is OK', () => {
			cy.withDataProvider({
				component: (
					<BorderControl
						{...defaultProps}
						defaultValue={{
							width: '0px',
							style: 'solid',
							color: '',
						}}
						id={'[0].data'}
					/>
				),
				value: [
					{
						data: {
							width: '10px',
							style: 'solid',
							color: '',
						},
					},
				],
			});

			cy.getByDataTest('border-control-width').should('have.value', '10');
		});

		it('should render default value when:defaultValue OK && id is invalid, value ok', () => {
			cy.withDataProvider({
				component: (
					<BorderControl
						{...defaultProps}
						defaultValue={{
							width: '20px',
							style: 'solid',
							color: '',
						}}
						id={'[0].x'}
					/>
				),
				value: [
					{
						data: {
							width: '10px',
							style: 'solid',
							color: '',
						},
					},
				],
			});

			cy.getByDataTest('border-control-width').should('have.value', '20');
		});

		it('should render default value when:defaultValue OK && id is valid, value is invalid', () => {
			cy.withDataProvider({
				component: (
					<BorderControl
						{...defaultProps}
						defaultValue={{
							width: '20px',
							style: 'solid',
							color: '',
						}}
						id={'[0].data'}
					/>
				),
				value: [
					{
						data: undefined,
					},
				],
			});

			cy.getByDataTest('border-control-width').should('have.value', '20');
		});

		it('should render value when:defaultValue !OK && id !OK && value exists on root', () => {
			cy.withDataProvider({
				component: <BorderControl {...defaultProps} />,
				value: {
					width: '30px',
					style: 'solid',
					color: '',
				},
			});

			cy.getByDataTest('border-control-width').should('have.value', '30');
		});
	});
});
