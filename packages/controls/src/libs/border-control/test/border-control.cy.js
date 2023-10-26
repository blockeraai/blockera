import { BorderControl } from '../../..';
import { select, dispatch } from '@wordpress/data';
import { addControl, modifyControlValue } from '../../../store/actions';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { getControlValue } from '../../../store/selectors';

describe('border-control component testing', () => {
	const name = 'border-control';
	const defaultProps = {
		field: 'border',
		defaultValue: {
			width: '0px',
			style: 'solid',
			color: '',
		},
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

	describe('test interaction : ', () => {
		it('render correctly', () => {
			cy.viewport(1000, 1000);
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
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <BorderControl {...defaultProps} />,
				value: {
					width: '0px',
					style: 'solid',
					color: '',
				},
				name,
			});

			cy.getByDataTest('border-control-width').clear().type(5);
			cy.getByDataTest('border-control-width').should('have.value', '5');

			// Check data provider value!
			cy.wait(100).then(() => {
				expect('5px').to.be.equal(getControlValue(name).width);
			});
		});

		it('dose onChange fire ?', () => {
			cy.stub(defaultProps, 'onChange').as('onChange');
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <BorderControl {...defaultProps} />,
				value: {
					width: '0px',
					style: 'solid',
					color: '',
				},
				name,
			});

			cy.getByDataTest('border-control-width').clear().type(10);
			cy.get('@onChange').should('have.been.called');
		});

		it('change style', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: <BorderControl {...defaultProps} />,
				value: {
					width: '0px',
					style: 'solid',
					color: '',
				},
				name,
			});

			// customSelectControl is not a real selectControl, and doesn't let us use normal select approaches

			cy.getByDataTest('border-control-color')
				.next()
				.click()
				.children('ul')
				.get('#downshift-8-item-2')
				.click();
			cy.wait(1000);
			cy.getByDataTest('border-control-color')
				.next()
				.click()
				.children('ul')
				.get('#downshift-8-item-2')
				.should('have.attr', 'aria-selected')
				.should('include', 'true');

			// Check data provider value!
			cy.wait(100).then(() => {
				expect('dotted').to.be.equal(getControlValue(name).style);
			});
		});

		describe('color picker :', () => {
			it('change color', () => {
				cy.viewport(1000, 1000);
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
				cy.get('#inspector-input-control-5').clear().type('ccc').blur();
				cy.getByDataTest('border-control-color')
					.should('have.attr', 'style')
					.should('include', 'ccc');

				// Check data provider value!
				cy.wait(100).then(() => {
					expect('#cccccc').to.be.equal(getControlValue(name).color);
				});
			});

			it('clear color', () => {
				cy.viewport(1000, 1000);
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
				cy.wait(100).then(() => {
					expect('#cccccc').to.be.equal(getControlValue(name).color);
				});

				//Clear color
				cy.getByDataTest('border-control-color').click();
				cy.contains('Clear').click();
				cy.getByDataTest('border-control-color')
					.should('have.attr', 'style')
					.should('be.empty');

				// Check data provider value!
				cy.wait(100).then(() => {
					expect('').to.be.equal(getControlValue(name).color);
				});
			});
		});
	});

	describe('test different styles', () => {
		it('render horizontal (default)', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: (
					<BorderControl
						{...defaultProps}
						linesDirection="horizontal"
					/>
				),
				value: { width: '0px', style: 'solid', color: '' },
				name,
			});

			cy.get(<BorderControl />).as('component');
			cy.get('@component').then((data) => {
				expect(data.selector.props.linesDirection).to.be.equal(
					'horizontal'
				);
			});
		});

		it('render vertical', () => {
			cy.viewport(1000, 1000);
			cy.withDataProvider({
				component: (
					<BorderControl
						{...defaultProps}
						linesDirection="vertical"
					/>
				),
				value: { width: '0px', style: 'solid', color: '' },
				name,
			});

			cy.get(<BorderControl linesDirection="vertical" />).as('component');
			cy.get('@component').then((data) => {
				expect(data.selector.props.linesDirection).to.be.equal(
					'vertical'
				);
			});
		});

		it('with field', () => {
			cy.viewport(1000, 1000);
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
					cy.viewport(1000, 1000);
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
					cy.viewport(1000, 1000);
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
					cy.viewport(1000, 1000);
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
					cy.viewport(1000, 1000);
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
					cy.viewport(1000, 1000);
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
					cy.viewport(1000, 1000);
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
});
