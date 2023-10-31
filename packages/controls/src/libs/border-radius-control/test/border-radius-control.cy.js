import BorderRadiusControl from '..';
import { nanoid } from 'nanoid';
import { getControlValue } from '../../../store/selectors';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { modifyControlValue } from '../../../store/actions';
import { select } from '@wordpress/data';

describe('border-radius-control component testing', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	it('render correctly', () => {
		cy.withDataProvider({
			component: <BorderRadiusControl />,
			value: {
				type: 'all',
				all: '0px',
			},
		});
		cy.get('input').should('exist');
	});

	it('render correctly with label', () => {
		cy.withDataProvider({
			component: <BorderRadiusControl label="Border Radius Control" />,
			value: {
				type: 'all',
				all: '0px',
			},
		});
		cy.contains('Border Radius Control');
	});

	it('render correctly with empty value and no default value', () => {
		cy.withDataProvider({
			component: <BorderRadiusControl />,
			value: {},
		});

		cy.get('input').should('have.value', '0');
	});

	it('render correctly with no value and no default value', () => {
		cy.withDataProvider({
			component: <BorderRadiusControl />,
		});

		cy.get('input').should('have.value', '0');
	});

	describe('all', () => {
		it('render correctly', () => {
			cy.withDataProvider({
				component: <BorderRadiusControl />,
				value: {
					type: 'all',
					all: '0px',
				},
			});
			cy.get('button[data-value="all"]')
				.should('have.attr', 'aria-checked')
				.should('be.equal', 'true');
		});

		describe('interaction test', () => {
			it('change input value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BorderRadiusControl />,
					value: {
						type: 'all',
						all: '0px',
					},
					name,
				});

				cy.get('input').clear();
				cy.get('input').type(10);

				cy.get('input').should('have.value', '10');

				//Check data provider value
				cy.get('input').then(() => {
					expect('10px').to.be.equal(getControlValue(name).all);
				});
			});

			it('change to custom', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BorderRadiusControl />,
					value: {
						type: 'all',
						all: '0px',
					},
					name,
				});

				cy.get('button[data-value="custom"]').click();

				cy.get('button[data-value="custom"]')
					.should('have.attr', 'aria-checked')
					.should('be.equal', 'true');

				//Check data provider value
				cy.get('input').then(() => {
					expect('custom').to.be.equal(getControlValue(name).type);
				});
			});
		});
	});

	describe('custom', () => {
		it('render correctly with customized value', () => {
			cy.withDataProvider({
				component: <BorderRadiusControl />,
				value: {
					type: 'custom',
					all: '0px',
					topLeft: '10px',
					topRight: '5px',
					bottomLeft: '35px',
					bottomRight: '25px',
				},
			});

			cy.get('input').eq(0).should('have.value', '10');
			cy.get('input').eq(1).should('have.value', '5');
			cy.get('input').eq(2).should('have.value', '35');
			cy.get('input').eq(3).should('have.value', '25');
		});

		describe('interaction test :', () => {
			it('should have same value as all when change to custom', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BorderRadiusControl />,
					value: {
						type: 'all',
						all: '10px',
					},
					name,
				});

				cy.get('button[data-value="custom"]').click();
				cy.get('input').should('have.value', '10');

				//Check data provider value
				cy.get('input').then(() => {
					expect({
						type: 'custom',
						all: '10px',
						topLeft: '10px',
						topRight: '10px',
						bottomLeft: '10px',
						bottomRight: '10px',
					}).to.be.deep.equal(getControlValue(name));
				});
			});

			it('change top-left', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BorderRadiusControl />,
					value: {
						type: 'custom',
						all: '0px',
						topLeft: '0px',
						topRight: '0px',
						bottomLeft: '0px',
						bottomRight: '0px',
					},
					name,
				});

				cy.get('input').eq(0).clear();
				cy.get('input').eq(0).type(5);
				cy.get('input').eq(0).should('have.value', '5');

				//Check data provider value
				cy.get('input').then(() => {
					expect({
						type: 'custom',
						all: '0px',
						topLeft: '5px',
						topRight: '0px',
						bottomLeft: '0px',
						bottomRight: '0px',
					}).to.be.deep.equal(getControlValue(name));
				});
			});

			it('change top-right', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BorderRadiusControl />,
					value: {
						type: 'custom',
						all: '0px',
						topLeft: '0px',
						topRight: '0px',
						bottomLeft: '0px',
						bottomRight: '0px',
					},
					name,
				});

				cy.get('input').eq(1).clear();
				cy.get('input').eq(1).type(10);
				cy.get('input').eq(1).should('have.value', '10');

				//Check data provider value
				cy.get('input').then(() => {
					expect({
						type: 'custom',
						all: '0px',
						topLeft: '0px',
						topRight: '10px',
						bottomLeft: '0px',
						bottomRight: '0px',
					}).to.be.deep.equal(getControlValue(name));
				});
			});

			it('change bottom-left', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <BorderRadiusControl />,
					value: {
						type: 'custom',
						all: '0px',
						topLeft: '0px',
						topRight: '0px',
						bottomLeft: '0px',
						bottomRight: '0px',
					},
					name,
				});

				cy.get('input').eq(2).clear();
				cy.get('input').eq(2).type(8);
				cy.get('input').eq(2).should('have.value', '8');

				//Check data provider value
				cy.get('input').then(() => {
					expect({
						type: 'custom',
						all: '0px',
						topLeft: '0px',
						topRight: '0px',
						bottomLeft: '8px',
						bottomRight: '0px',
					}).to.be.deep.equal(getControlValue(name));
				});
			});
		});
		it('change bottom-right', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <BorderRadiusControl />,
				value: {
					type: 'custom',
					all: '0px',
					topLeft: '0px',
					topRight: '0px',
					bottomLeft: '0px',
					bottomRight: '0px',
				},
				name,
			});

			cy.get('input').eq(3).clear();
			cy.get('input').eq(3).type(15);
			cy.get('input').eq(3).should('have.value', '15');

			//Check data provider value
			cy.get('input').then(() => {
				expect({
					type: 'custom',
					all: '0px',
					topLeft: '0px',
					topRight: '0px',
					bottomLeft: '0px',
					bottomRight: '15px',
				}).to.be.deep.equal(getControlValue(name));
			});
		});
	});

	describe('test useControlContext', () => {
		it('should render default value when:defaultValue OK && id !OK && value is undefined', () => {
			cy.withDataProvider({
				component: (
					<BorderRadiusControl
						defaultValue={{
							type: 'all',
							all: '5px',
						}}
					/>
				),
			});

			cy.get('input').should('have.value', '5');
		});

		it('should render default value when:defaultValue OK && id !OK && value is undefined (passing custom to type)', () => {
			cy.withDataProvider({
				component: (
					<BorderRadiusControl
						defaultValue={{
							type: 'custom',
							all: '5px',
							topLeft: '5px',
							topRight: '5px',
							bottomLeft: '5px',
							bottomRight: '5px',
						}}
					/>
				),
			});

			cy.get('input').should('have.value', '5');
		});

		it('should render value when: defaultValue OK && id OK && value is OK', () => {
			cy.withDataProvider({
				component: (
					<BorderRadiusControl
						defaultValue={{
							type: 'all',
							all: '5px',
						}}
						id={'[0]'}
					/>
				),
				value: [
					{
						type: 'all',
						all: '10px',
					},
				],
			});

			cy.get('input').should('have.value', '10');
		});

		it('should render default value when:defaultValue OK && id is invalid, value ok', () => {
			cy.withDataProvider({
				component: (
					<BorderRadiusControl
						defaultValue={{
							type: 'all',
							all: '5px',
						}}
						id={'[1]'}
					/>
				),
				value: [
					{
						type: 'all',
						all: '10px',
					},
				],
			});

			cy.get('input').should('have.value', '5');
		});

		it('should render default value when:defaultValue OK && id is valid, value is invalid', () => {
			cy.withDataProvider({
				component: (
					<BorderRadiusControl
						defaultValue={{
							type: 'all',
							all: '5px',
						}}
						id={'[0].data'}
					/>
				),
				value: [{ data: undefined }],
			});

			cy.get('input').should('have.value', '5');
		});

		it('should render value when:defaultValue !OK && id !OK && value exists on root', () => {
			cy.withDataProvider({
				component: <BorderRadiusControl />,
				value: {
					type: 'all',
					all: '10px',
				},
			});

			cy.get('input').should('have.value', '10');
		});
	});

	it('does onChange fire?', () => {
		const name = nanoid();
		const defaultValue = {
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

		cy.stub(defaultValue, 'onChange').as('onChange');

		cy.withDataProvider({
			component: <BorderRadiusControl {...defaultValue} />,
			value: {
				type: 'all',
				all: '0px',
			},
			name,
		});

		cy.get('input').type('5');

		cy.get('@onChange').should('have.been.called');
	});
});
