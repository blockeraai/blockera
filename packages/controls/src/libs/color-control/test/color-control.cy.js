import ColorControl from '../control';

describe('Color Control', () => {
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('Default', () => {
		it('renders a button with icon and label inside it', () => {
			cy.withDataProvider({ component: <ColorControl /> });
			cy.get('.components-button').as('btn');
			cy.get('@btn').find('.color-label');
			cy.get('@btn').find('.color-none');
		});

		it('get correct default value', () => {
			cy.withDataProvider({
				component: <ColorControl defaultValue="red" />,
			});
			cy.get('.color-label').contains('red');
			cy.get('.color-custom').should(
				'have.css',
				'backgroundColor',
				'rgb(255, 0, 0)'
			);
		});

		it('opens color picker by clicking on it', () => {
			cy.withDataProvider({ component: <ColorControl />, value: '' });
			cy.get('.components-button').as('btn');

			cy.get('@btn').click();
			cy.get('.publisher-component-popover-header');
		});

		it('changing color in color picker, changes it in color control as expected', () => {
			cy.withDataProvider({ component: <ColorControl />, value: '' });
			cy.get('.components-button').as('btn');

			cy.get('@btn').click();

			cy.get('input').clear().type('eee');
			cy.get('.color-label').contains('#eee');
			cy.get('.color-custom').should(
				'have.css',
				'backgroundColor',
				'rgb(238, 238, 238)'
			);
		});

		it('calls onChange handler passed as prop when changing the color', () => {
			const onChangeMock = cy.stub().as('onChangeMock');
			cy.withDataProvider({
				component: <ColorControl onChange={onChangeMock} />,
				value: '',
			});
			cy.get('.components-button').as('btn');
			cy.get('@btn').click();
			cy.get('input').clear().type('eee');

			cy.get('@onChangeMock').should('have.been.called');
		});
	});

	context('Minimal', () => {
		it('renders minimal type, correctly', () => {
			cy.withDataProvider({ component: <ColorControl type="minimal" /> });
			cy.get('.color-none');
			cy.get('.color-label').should('not.exist');
		});
	});

	context('useControlContext', () => {
		it('should retrieve data from useControlContext with simple value without id', () => {
			cy.withDataProvider({
				component: <ColorControl />,
				value: 'red',
			});

			cy.get('.color-label').contains('red');
			cy.get('.color-custom').should(
				'have.css',
				'backgroundColor',
				'rgb(255, 0, 0)'
			);
		});

		it('should retrieve data from useControlContext with complex value with id', () => {
			cy.withDataProvider({
				component: <ColorControl id="x.y[0].z" />,
				value: {
					x: {
						y: [{ z: '#eee' }],
					},
				},
			});

			cy.get('.color-label').contains('#eee');
			cy.get('.color-custom').should(
				'have.css',
				'backgroundColor',
				'rgb(238, 238, 238)'
			);
		});
	});
});
