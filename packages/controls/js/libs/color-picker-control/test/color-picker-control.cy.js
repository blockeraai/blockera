import { getControlValue } from '../../../store/selectors';
import ColorPickerControl from '../color-picker-control';
import { nanoid } from 'nanoid';

class DOMException extends Error {
	constructor(message) {
		super(message);
		this.name = 'DOMException';
	}
}

const abortSignal = () => {
	return new DOMException(
		"Failed to execute 'open' on 'EyeDropper': Color selection aborted."
	);
};
const abortSignalDuring = () => {
	return new DOMException('Color selection aborted.');
};

class EyeDropper {
	_getColor() {
		return 'rgb(255, 255, 255)';
	}
	_setOpen() {
		EyeDropper.isOpen = true;
	}
	_setClosed() {
		EyeDropper.isOpen = false;
	}
	_getTimeout() {
		return 2000;
	}
	open(options) {
		return new Promise((resolve, reject) => {
			const signal = options?.signal;
			const onAbortDuring = () => {
				clearTimeout(resolveTimeout);
				this._setClosed();
				reject(abortSignalDuring());
			};
			if (signal) {
				if (signal.aborted) {
					reject(abortSignal());
					return;
				}
				signal.addEventListener('abort', onAbortDuring);
			}
			this._setOpen();
			const resolveTimeout = setTimeout(() => {
				if (signal) signal.removeEventListener('abort', onAbortDuring);
				this._setClosed();
				resolve({ sRGBHex: this._getColor() });
			}, this._getTimeout());
		});
	}
}

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
			cy.get('[aria-label="Reset Color (Clear)"]').click({ force: true });

			// visual and data assertion
			cy.get('[id^=inspector-input-control-]')
				.should('have.value', '000000')
				.then(() => {
					expect(Boolean(getControlValue(name))).to.be.equal(false);
				});
		});

		it('should EyeDropper works right', () => {
			global.window.EyeDropper = EyeDropper;
			global.window.EyeDropper.isOpen = false;

			const name = nanoid();
			cy.withDataProvider({
				component: (
					<ColorPickerControl isOpen={true} isPopover={true} />
				),
				value: '#ccc',
				name,
			});

			cy.getByAriaLabel('Pick Color').click();
			cy.getByDataTest('popover-header')
				.parent()
				.parent()
				.should('have.attr', 'class')
				.should('include', 'hidden');

			// eslint-disable-next-line cypress/no-unnecessary-waiting
			cy.wait(3000);

			cy.getByDataTest('popover-header')
				.parent()
				.parent()
				.should('have.attr', 'class')
				.should('not.include', 'hidden');

			cy.get('body').then(() => {
				expect('rgb(255, 255, 255)').to.be.equal(getControlValue(name));
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
