import { getControlValue } from '../../../store/selectors';
import ColorControl from '../control';

describe('Color Control', () => {
	const name = 'color-control';
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('Rendering Tests', () => {
		it('renders a button with icon and label inside it', () => {
			cy.withDataProvider({
				component: <ColorControl />,
			});
			cy.getByDataCy('color-btn');
			cy.getByDataCy('color-label');
			cy.getByDataCy('color-indicator');
		});

		it('renders minimal type, correctly', () => {
			cy.withDataProvider({
				component: <ColorControl type="minimal" />,
			});
			cy.getByDataCy('color-indicator');
			cy.getByDataCy('color-label').should('not.exist');
		});

		it('renders None as color label when no color is selected', () => {
			cy.withDataProvider({
				component: <ColorControl />,
			});
			cy.getByDataCy('color-indicator');
			cy.getByDataCy('color-label').should('have.text', 'None');
		});
	});

	context('Functional Tests', () => {
		it('should open and close color picker by clicking on color control', () => {
			cy.withDataProvider({
				component: <ColorControl popoverTitle="custom popover title" />,
				value: '',
			});
			cy.getByDataCy('color-btn').as('btn');

			cy.get('@btn').click();
			cy.contains('custom popover title');

			cy.get('@btn').click();
			cy.contains('custom popover title').should('not.exist');
		});

		it('changing color in color picker, changes it in color control as expected', () => {
			cy.withDataProvider({
				component: <ColorControl />,
				value: '',
				name,
			});
			cy.getByDataCy('color-btn').as('btn');

			cy.get('@btn').click();
			cy.get('input').clear();
			cy.get('input').type('ddd');

			// visual assertion
			cy.getByDataCy('color-label').contains('#ddd');
			cy.getByDataCy('color-indicator').should(
				'have.css',
				'backgroundColor',
				'rgb(221, 221, 221)'
			);

			// data assertion
			cy.getByDataCy('color-label')
				.contains('#ddd')
				.then(() => {
					expect(getControlValue(name)).to.be.equal('#dddddd');
				});
		});

		it('renders None as color label when color gets remove from color-picker', () => {
			cy.withDataProvider({
				component: <ColorControl />,
				value: '#832828',
				name,
			});

			cy.getByDataCy('color-btn').click();
			cy.contains(/clear/i).as('clearBtn').click();

			// visual and data assertion
			cy.getByDataCy('color-label')
				.should('have.text', 'None')
				.then(() => {
					expect(getControlValue(name)).to.be.equal('');
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

			cy.getByDataCy('color-label').contains('#1b44b5');
		});

		// 2.
		it('calculated defaultValue must be value, when defaultValue(ok) && id(!ok) && value(ok)', () => {
			cy.withDataProvider({
				component: <ColorControl defaultValue="#1b44b5" id="x.y" />,
				value: '#eee',
			});

			cy.getByDataCy('color-label').contains('#1b44b5');
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

			cy.getByDataCy('color-label').contains('#1b44b5');
		});

		// 4.
		it('calculated data must be value, when id(!ok), defaultValue(!ok), value(root)', () => {
			cy.withDataProvider({
				component: <ColorControl />,
				value: '#1b44b5',
			});

			cy.getByDataCy('color-label').contains('#1b44b5');
		});
	});
});
