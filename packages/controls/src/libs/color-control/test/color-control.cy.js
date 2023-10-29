import { getControlValue } from '../../../store/selectors';
import ColorControl from '../control';

describe('Color Control', () => {
	const name = 'color-control';
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('Visual Tests', () => {
		it('renders a button with icon and label inside it', () => {
			cy.withDataProvider({ component: <ColorControl /> });
			cy.get('.components-button').as('btn');
			cy.get('@btn').find('.color-label');
			cy.get('@btn').find('.color-none');
		});

		it('renders minimal type, correctly', () => {
			cy.withDataProvider({
				component: <ColorControl type="minimal" />,
			});
			cy.get('.color-none');
			cy.get('.color-label').should('not.exist');
		});
	});

	context('Behavioral Tests', () => {
		it('should open and close color picker by clicking on color control', () => {
			cy.withDataProvider({ component: <ColorControl />, value: '' });
			cy.get('.components-button').as('btn');

			cy.get('@btn').click();
			cy.get('.publisher-component-popover-header');
			cy.get('@btn').eq(0).click();
			cy.get('.publisher-component-popover-header').should('not.exist');
		});

		it('changing color in color picker, changes it in color control as expected', () => {
			cy.withDataProvider({
				component: <ColorControl />,
				value: '',
				name,
			});
			cy.get('.components-button').as('btn');

			cy.get('@btn').click();
			cy.get('input').clear();
			cy.get('input').type('ddd');

			// visual assertion
			cy.get('.color-label').contains('#ddd');
			cy.get('.color-custom').should(
				'have.css',
				'backgroundColor',
				'rgb(221, 221, 221)'
			);

			// data assertion
			cy.get('.color-label')
				.contains('#ddd')
				.then(() => {
					expect(getControlValue(name)).to.be.equal('#dddddd');
				});
		});
	});

	context('Initial Value', () => {
		// 1.
		it('calculated data must be defaultValue, when defaultValue(ok) && id(!ok) value(undefined)', () => {
			cy.withDataProvider({
				component: <ColorControl defaultValue="#1b44b5" />,
				value: undefined,
			});

			cy.get('.color-label').contains('#1b44b5');
		});

		// 2.
		it('calculated defaultValue must be value, when defaultValue(ok) && id(!ok) && value(ok)', () => {
			cy.withDataProvider({
				component: <ColorControl defaultValue="#1b44b5" id="x.y" />,
				value: '#eee',
			});

			cy.get('.color-label').contains('#1b44b5');
		});

		// 3.
		it('calculated data must be defaultValue, when defaultValue(ok) && id(ok) && value(undefined)', () => {
			cy.withDataProvider({
				component: (
					<ColorControl id="x[0].b[0].c" defaultValue="#1b44b5" />
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

			cy.get('.color-label').contains('#1b44b5');
		});

		// 4.
		it('calculated data must be value, when id(!ok), defaultValue(!ok), value(root)', () => {
			cy.withDataProvider({
				component: <ColorControl />,
				value: '#1b44b5',
			});

			cy.get('.color-label').contains('#1b44b5');
		});
	});
});
