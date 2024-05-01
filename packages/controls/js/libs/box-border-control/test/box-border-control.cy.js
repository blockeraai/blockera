import BoxBorderControl from '..';
import { nanoid } from 'nanoid';
import { getControlValue } from '../../../store/selectors';
import { controlReducer } from '../../../store/reducers/control-reducer';
import { modifyControlValue } from '../../../store/actions';
import { select } from '@wordpress/data';

describe('box-border-control component testing', () => {
	it('should render correctly', () => {
		cy.withDataProvider({
			component: <BoxBorderControl />,
			value: {
				type: 'all',
				all: {
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				},
			},
		});

		cy.contains('2');
	});

	it('should render correctly with label', () => {
		cy.withDataProvider({
			component: <BoxBorderControl label="Box Border" />,
			value: {
				type: 'all',
				all: {
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				},
			},
		});

		cy.contains('Box Border');
	});

	it('should render correctly with empty value', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <BoxBorderControl label="empty" />,
			value: {},
			name,
		});

		cy.get('input[type="number"]').should('have.value', '');

		cy.getByAriaLabel('Custom Box Border')
			.should('have.attr', 'style')
			.should('include', 'var(--blockera-controls-color)');
	});

	it('should render correctly with no value and default value', () => {
		const name = nanoid();
		cy.withDataProvider({
			component: <BoxBorderControl label="empty" />,
			name,
		});

		cy.get('input[type="number"]').should('have.value', '');

		cy.getByAriaLabel('Custom Box Border')
			.should('have.attr', 'style')
			.should('include', 'var(--blockera-controls-color)');
	});

	describe('interaction test (type : all)', () => {
		it('should context and local value be updated, when change width', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: <BoxBorderControl />,
				value: {
					type: 'all',
					all: {
						width: '2px',
						style: 'solid',
						color: '#0947eb',
					},
				},
				name,
			});

			cy.get('input[type="number"]').clear();
			cy.get('input[type="number"]').type('10');

			cy.get('input[type="number"]').should('have.value', '10');

			//Check data provider
			cy.get('body').then(() => {
				expect('10px').to.be.equal(getControlValue(name).all.width);
			});
		});

		it('should context and local value be updated, when change to custom', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: <BoxBorderControl />,
				value: {
					type: 'all',
					all: {
						width: '2px',
						style: 'solid',
						color: '#0947eb',
					},
				},
				name,
			});

			cy.getByAriaLabel('Custom Box Border').click();
			cy.getByAriaLabel('Custom Box Border')
				.should('have.attr', 'style')
				.should('include', 'var(--blockera-controls-primary-color)');

			//Check data provider
			cy.get('body').then(() => {
				expect('custom').to.be.equal(getControlValue(name).type);
			});
		});
	});

	describe('interaction test (type : custom)', () => {
		const value = {
			type: 'custom',
			all: {
				width: '0px',
				style: 'solid',
				color: '',
			},
			left: {
				width: '0px',
				style: 'solid',
				color: '',
			},
			right: {
				width: '0px',
				style: 'solid',
				color: '',
			},
			top: {
				width: '0px',
				style: 'solid',
				color: '',
			},
			bottom: {
				width: '0px',
				style: 'solid',
				color: '',
			},
		};

		it('should each side have same value as all when change to custom', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: <BoxBorderControl />,
				value: {
					type: 'all',
					all: {
						width: '2px',
						style: 'solid',
						color: '#0947eb',
					},
				},
				name,
			});

			cy.getByAriaLabel('Custom Box Border').click();

			cy.get('input[type="number"]').should('have.value', '2');

			//Check data provider
			cy.get('body').then(() => {
				expect({
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				}).to.be.deep.equal(getControlValue(name).top);
				expect({
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				}).to.be.deep.equal(getControlValue(name).right);
				expect({
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				}).to.be.deep.equal(getControlValue(name).bottom);
				expect({
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				}).to.be.deep.equal(getControlValue(name).left);
			});
		});

		it('should context and local value be updated, when change width of top border', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: <BoxBorderControl />,
				value,
				name,
			});

			cy.get('input[type="number"]').eq(0).as('top-width-input');
			cy.get('@top-width-input').clear();
			cy.get('@top-width-input').type(5);

			cy.get('@top-width-input').should('have.value', '5');

			//Check data provider value
			cy.get('@top-width-input').then(() => {
				expect('5px').to.be.equal(getControlValue(name).top.width);
			});
		});

		it('should context and local value be updated, when change color of right border', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: <BoxBorderControl />,
				value,
				name,
			});

			cy.getByDataCy('color-btn').eq(1).as('right-color-button');
			cy.get('@right-color-button').click();
			cy.get('input[maxlength="9"]').clear();
			cy.get('input[maxlength="9"]').type('b0da3b');

			cy.get('@right-color-button')
				.should('have.attr', 'style')
				.should('include', 'b0da3b');

			//Check data provider value
			cy.get('@right-color-button').then(() => {
				expect('#b0da3b').to.be.equal(
					getControlValue(name).right.color
				);
			});
		});

		it('should context and local value be updated, when change style of bottom border', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: <BoxBorderControl />,
				value,
				name,
			});

			cy.get('button[aria-haspopup="listbox"]')
				.eq(2)
				.as('bottom-style-button');
			cy.get('@bottom-style-button').click();
			cy.get('ul').get('li').eq(3).click();

			cy.get('@bottom-style-button').click();
			cy.get('ul')
				.get('li')
				.eq(3)
				.should('have.attr', 'aria-selected')
				.should('be.equal', 'true');

			//Check data provider value
			cy.get('@bottom-style-button').then(() => {
				expect('double').to.be.equal(
					getControlValue(name).bottom.style
				);
			});
		});

		it('should context and local value be updated, when change width of left border', () => {
			const name = nanoid();

			cy.withDataProvider({
				component: <BoxBorderControl />,
				value,
				name,
			});

			cy.get('input[type="number"]').eq(3).as('left-width-input');
			cy.get('@left-width-input').clear();
			cy.get('@left-width-input').type(10);

			cy.get('@left-width-input').should('have.value', '10');

			//Check data provider value
			cy.get('@left-width-input').then(() => {
				expect('10px').to.be.equal(getControlValue(name).left.width);
			});
		});
	});

	describe('test useControlContext', () => {
		it('should render default value when:defaultValue OK && id !OK && value is undefined', () => {
			cy.withDataProvider({
				component: (
					<BoxBorderControl
						defaultValue={{
							type: 'all',
							all: {
								width: '2px',
								style: 'solid',
								color: '#0947eb',
							},
						}}
					/>
				),
			});

			cy.get('input[type="number"]').should('have.value', '2');
		});

		it('should render value when: defaultValue OK && id OK && value is OK', () => {
			cy.withDataProvider({
				component: (
					<BoxBorderControl
						defaultValue={{
							type: 'all',
							all: {
								width: '2px',
								style: 'solid',
								color: '#0947eb',
							},
						}}
						id={'[0]'}
					/>
				),
				value: [
					{
						type: 'all',
						all: {
							width: '5px',
							style: 'dashed',
							color: '#000000',
						},
					},
				],
			});

			cy.get('input[type="number"]').should('have.value', '5');
		});

		it('should render default value when:defaultValue OK && id is invalid, value ok', () => {
			cy.withDataProvider({
				component: (
					<BoxBorderControl
						defaultValue={{
							type: 'all',
							all: {
								width: '2px',
								style: 'solid',
								color: '#0947eb',
							},
						}}
						id={'[1]'}
					/>
				),
				value: [
					{
						type: 'all',
						all: {
							width: '5px',
							style: 'dashed',
							color: '#000000',
						},
					},
				],
			});

			cy.get('input[type="number"]').should('have.value', '2');
		});

		it('should render default value when:defaultValue OK && id is valid, value is invalid', () => {
			cy.withDataProvider({
				component: (
					<BoxBorderControl
						defaultValue={{
							type: 'all',
							all: {
								width: '2px',
								style: 'solid',
								color: '#0947eb',
							},
						}}
						id={'[0].data'}
					/>
				),
				value: [{ data: undefined }],
			});

			cy.get('input[type="number"]').should('have.value', '2');
		});

		it('should render value when:defaultValue !OK && id !OK && value exists on root', () => {
			cy.withDataProvider({
				component: <BoxBorderControl />,
				value: {
					type: 'all',
					all: {
						width: '5px',
						style: 'dashed',
						color: '#000000',
					},
				},
			});

			cy.get('input[type="number"]').should('have.value', '5');
		});
	});

	it('should onChange be called, when interacting', () => {
		const defaultProps = {
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

		cy.stub(defaultProps, 'onChange').as('onChange');
		cy.withDataProvider({
			component: <BoxBorderControl {...defaultProps} />,
			value: {
				type: 'all',
				all: {
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				},
			},
		});

		cy.get('input[type="number"]').clear();

		cy.get('@onChange').should('have.been.called');
	});
});

