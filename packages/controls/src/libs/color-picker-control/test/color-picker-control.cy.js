import { getControlValue } from '../../../store/selectors';
import ColorPickerControl from '../color-picker-control';
describe('Color-Picker Control', () => {
	const name = 'color-picker-control';
	beforeEach(() => {
		cy.viewport(1280, 720);
	});

	context('Initial Rendering Tests', () => {
		it('should be rendered as popover when isPopover=true', () => {
			cy.withDataProvider({
				component: (
					<ColorPickerControl isOpen={true} isPopover={true} />
				),
				value: '#eee',
			});

			cy.getByDataTest('popover-body');
		});

		it('should be rendered without popover when isPopover=false', () => {
			cy.withDataProvider({
				component: (
					<ColorPickerControl isOpen={true} isPopover={false} />
				),
				value: '#eee',
			});

			cy.getByDataTest('popover-body').should('not.exist');
		});
	});

	context('Functional Tests', () => {
		it('picks correct color by entering HEX code into input', () => {
			cy.withDataProvider({
				component: (
					<ColorPickerControl isOpen={true} isPopover={false} />
				),
				value: '#eee',
				name,
			});

			cy.get('[id^=inspector-input-control-]').clear();
			cy.get('[id^=inspector-input-control-]').type('283f8a');

			// visual and data assertion
			cy.get('.react-colorful__saturation-pointer')
				.find('.react-colorful__pointer-fill')
				.should('have.css', 'backgroundColor', 'rgb(40, 63, 138)')
				.then(() => {
					expect(getControlValue(name)).to.be.equal('#283f8a');
				});
		});

		it('should clear value by clicking on clear button', () => {
			cy.withDataProvider({
				component: (
					<ColorPickerControl isOpen={true} isPopover={false} />
				),
				value: '#283f8a',
				name,
			});

			cy.get('[id^=inspector-input-control-]').clear();
			cy.get('[id^=inspector-input-control-]').type('283f8a');
			cy.get('[aria-label=reset-color]').click();

			// visual and data assertion
			cy.get('[id^=inspector-input-control-]')
				.should('have.value', '000000')
				.then(() => {
					expect(Boolean(getControlValue(name))).to.be.equal(false);
				});
		});
	});

	context('Initial Value Tests', () => {
		// 1.
		it('calculated data must be defaultValue, when defaultValue(ok) && id(!ok) value(undefined)', () => {
			cy.withDataProvider({
				component: (
					<ColorPickerControl
						defaultValue="#283f8a"
						isOpen={true}
						isPopover={false}
					/>
				),
				value: undefined,
			});

			cy.get('[id^=inspector-input-control-]').should(
				'have.value',
				'283F8A'
			);
			cy.get('.react-colorful__saturation-pointer')
				.find('.react-colorful__pointer-fill')
				.should('have.css', 'backgroundColor', 'rgb(40, 63, 138)');
		});

		// 2.
		it('calculated defaultValue must be value, when defaultValue(ok) && id(!ok) && value(ok)', () => {
			cy.withDataProvider({
				component: (
					<ColorPickerControl
						defaultValue="#283f8a"
						id="x.y"
						isOpen={true}
					/>
				),
				value: '#eeeeee',
			});

			cy.get('[id^=inspector-input-control-]').should(
				'have.value',
				'283F8A'
			);
			cy.get('.react-colorful__saturation-pointer')
				.find('.react-colorful__pointer-fill')
				.should('have.css', 'backgroundColor', 'rgb(40, 63, 138)');
		});

		// 3.
		it('calculated data must be defaultValue, when defaultValue(ok) && id(ok) && value(undefined)', () => {
			cy.withDataProvider({
				component: (
					<ColorPickerControl
						id="x[0].b[0].c"
						defaultValue="#283f8a"
						isOpen={true}
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

			cy.get('[id^=inspector-input-control-]').should(
				'have.value',
				'283F8A'
			);
			cy.get('.react-colorful__saturation-pointer')
				.find('.react-colorful__pointer-fill')
				.should('have.css', 'backgroundColor', 'rgb(40, 63, 138)');
		});

		// 4.
		it('calculated data must be value, when id(!ok), defaultValue(!ok), value(root)', () => {
			cy.withDataProvider({
				component: <ColorPickerControl isOpen={true} />,
				value: '#283f8a',
			});

			cy.get('[id^=inspector-input-control-]').should(
				'have.value',
				'283F8A'
			);
			cy.get('.react-colorful__saturation-pointer')
				.find('.react-colorful__pointer-fill')
				.should('have.css', 'backgroundColor', 'rgb(40, 63, 138)');
		});
	});
});
