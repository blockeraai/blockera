/// <reference types="Cypress" />

import { getControlValue } from '../../../store/selectors';
import { default as InputControl } from '../index';
import { nanoid } from 'nanoid';

describe('input control component testing', () => {
	beforeEach(() => {
		// run these tests as if in a desktop
		// browser with a 720p monitor
		cy.viewport(1280, 720);
	});

	describe('General', () => {
		it('should render label prop value', () => {
			cy.withDataProvider({
				component: <InputControl label="Example Label" />,
			});

			cy.get('[aria-label="Example Label"]').should('exist');
		});

		it('should control data value must be equal with expected data value passed in data provider access with control identifier', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<InputControl
						defaultValue={'default value'}
						id={'inputControl'}
					/>
				),
				value: {
					inputControl: 'input value',
				},
				name,
			});

			cy.get('input').should('have.value', 'input value');
			cy.then(() => {
				return expect(getControlValue(name).inputControl).to.eq(
					'input value'
				);
			});
		});

		it('should control data value equal with expected defaultValue when id of context value was not defined', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: (
					<InputControl
						defaultValue={'default value'}
						id={'inputControl.value'}
					/>
				),
				value: {
					inputControl: {
						value: undefined,
					},
				},
				name,
			});

			cy.get('input').should('have.value', 'default value');
			cy.then(() => {
				return expect(getControlValue(name).inputControl.value).to.eq(
					undefined
				);
			});
		});

		it('should control data value equal with expected defaultValue when id was not provided for InputControl', () => {
			cy.withDataProvider({
				component: (
					<InputControl defaultValue={'default value'} id="invalid" />
				),
				value: {
					inputControl: {
						value: 'value',
					},
				},
				name,
			});
			cy.get('input').should('have.value', 'default value');
		});

		it('should render placeholder', () => {
			cy.withDataProvider({
				component: (
					<InputControl placeholder="My placeholder" type="number" />
				),
			});

			cy.get('input[placeholder*="My placeholder"]').should('exist');
		});

		it('disabled', () => {
			cy.withDataProvider({
				component: <InputControl type="number" disabled={true} />,
			});

			cy.get('input').should('be.disabled');
		});
	});

	describe('Text Input', () => {
		it('should display value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl defaultValue={'default value'} />,
				name,
				value: 'value',
			});

			cy.get('input').should('have.value', 'value');
			cy.then(() => {
				return expect(getControlValue(name)).to.eq('value');
			});
		});

		it('should display default value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl defaultValue={'default value'} />,
				name,
				value: '',
			});

			cy.get('input').should('have.value', 'default value');
			cy.then(() => {
				return expect(getControlValue(name)).to.eq('');
			});
		});

		it('should display onchanged value', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl />,
				name,
			});

			cy.get('input').focus();
			cy.get('input').type('test');
			cy.should('have.value', 'test');
			cy.then(() => {
				return expect(getControlValue(name)).to.eq('test');
			});
		});

		it('should render clear input', () => {
			const name = nanoid();
			cy.withDataProvider({
				component: <InputControl />,
				name,
			});

			cy.get('input').focus();
			cy.get('input').type('this is a text');
			cy.get('input').clear();
			cy.get('input').should('have.value', '');
			cy.then(() => {
				return expect(getControlValue(name)).to.eq('');
			});
		});
	});

	describe('Number Input', () => {
		describe('General', () => {
			it('should display value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" defaultValue={10} />,
					name,
					value: 20,
				});

				cy.get('input').should('have.value', 20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(20);
				});
			});

			it('should display default value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" defaultValue={10} />,
					name,
					value: '',
				});

				cy.get('input').should('have.value', 10);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('');
				});
			});

			it('should display onchanged value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').type(20);
				cy.get('input').should('have.value', 20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(20);
				});
			});
		});

		describe('Typing', () => {
			it('type simple number', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').type(20);
				cy.get('input').should('have.value', 20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(20);
				});
			});

			it('type float number', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').type(2.0);
				cy.get('input').should('have.value', 2.0);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(2.0);
				});
			});

			it('type float number - Float Disabled', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" float={false} />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').type(2);
				cy.get('input').type('.');
				cy.get('input').type(2);
				cy.get('input').should('have.value', 22);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(22);
				});
			});

			it('type negative number', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').type(-20);
				cy.get('input').should('have.value', -20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(-20);
				});
			});

			it('type negative float number', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
					value: '',
				});

				cy.get('input').focus();
				cy.get('input').type('-2.1');
				cy.get('input').should('have.value', '-2.1');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(-2.1);
				});
			});

			it('type negative float number (2 times)', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
					value: '',
				});

				cy.get('input').focus();
				cy.get('input').type('-2.0');
				cy.get('input').type('-');
				cy.get('input').type(2);
				cy.get('input').type('.');
				cy.get('input').type(1);

				cy.get('input').should('have.value', '-2.021');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(-2.021);
				});
			});

			it('type smaller value than min value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" min={10} />,
					name,
					value: '',
				});

				cy.get('input').focus();
				cy.get('input').type(9); // changes value to 10
				cy.get('input').type(0); // it's 100 now

				cy.get('input').should('have.value', 100);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(100);
				});
			});

			it('type larger value than max value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" max={10} />,
					name,
					value: '',
				});

				cy.get('input').focus();
				cy.get('input').type(1); // 1
				cy.get('input').type(1); // 10
				cy.get('input').type(1); // 10

				cy.get('input').should('have.value', 10);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(10);
				});
			});
		});

		describe('Paste', () => {
			it('paste simple number', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').pasteText('20');

				cy.get('input').should('have.value', 20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(20);
				});
			});

			it('paste float number', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').pasteText('2.1');

				cy.get('input').should('have.value', '2.1');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(2.1);
				});
			});

			it('paste float number - Float Disabled', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" float={false} />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').pasteText('2.1');

				cy.get('input').should('have.value', 21);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(21);
				});
			});

			it('paste negative number', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').pasteText('-20');

				cy.get('input').should('have.value', -20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(-20);
				});
			});

			it('paste negative float number', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').pasteText('-2.0');

				cy.get('input').should('have.value', '-2.0');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(-2.0);
				});
			});

			it('paste negative float number (2 times)', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').pasteText('-2.0');
				cy.get('input').pasteText('-2');

				cy.get('input').should('have.value', '-2.02');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(-2.02);
				});
			});

			it('paste smaller value than min value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" min={10} />,
					name,
					value: '',
				});

				cy.get('input').focus();
				cy.get('input').pasteText('9');

				cy.get('input').should('have.value', 10);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(10);
				});
			});

			it('paste larger value than max value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" max={10} />,
					name,
					value: '',
				});

				cy.get('input').focus();
				cy.get('input').pasteText('100');

				cy.get('input').should('have.value', 10);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(10);
				});
			});

			it('paste invalid', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" max={10} />,
					name,
					value: '',
				});

				cy.get('input').focus();
				cy.get('input').pasteText('akbar');

				cy.get('input').should('have.value', '');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('');
				});
			});
		});

		describe('Arrows', () => {
			it('should render arrows and work', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl type="number" arrows={true} />,
					name,
					value: 0,
				});

				cy.getByDataTest('arrows-container').should('exist');

				cy.getByDataTest('arrow-up').click();
				cy.get('input').should('have.value', 1);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(1);
				});

				cy.getByDataTest('arrow-down').click();
				cy.getByDataTest('arrow-down').click();
				cy.get('input').should('have.value', -1);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(-1);
				});
			});

			it('check min and max', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							arrows={true}
							min={0}
							max={3}
						/>
					),
					name,
					value: 0,
				});

				cy.getByDataTest('arrows-container').should('exist');

				cy.getByDataTest('arrow-up').click(); // 1
				cy.getByDataTest('arrow-up').click(); // 2
				cy.getByDataTest('arrow-up').click(); // 3
				cy.getByDataTest('arrow-up').should(
					'have.css',
					'pointer-events',
					'none'
				);
				cy.get('input').should('have.value', 3);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(3);
				});

				cy.getByDataTest('arrow-down').click(); // 3
				cy.getByDataTest('arrow-down').click(); // 2
				cy.getByDataTest('arrow-down').click(); // 1
				cy.getByDataTest('arrow-down').should(
					'have.css',
					'pointer-events',
					'none'
				);
				cy.get('input').should('have.value', 0);

				cy.getByDataTest('arrow-up').click();
				cy.get('input').should('have.value', 1);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(1);
				});
			});

			it('Disabled Arrows', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							arrows={true}
							disabled={true}
						/>
					),
					name,
					value: 0,
				});

				cy.get('input[type=number]').should('be.disabled');
				cy.getByDataTest('arrow-up').should(
					'have.css',
					'pointer-events',
					'none'
				);
				cy.getByDataTest('arrow-down').should(
					'have.css',
					'pointer-events',
					'none'
				);
			});
		});

		describe('Validator', () => {
			it('validator works or not', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							max={10}
							validator={(value) => {
								return value === 10;
							}}
						/>
					),
					name,
					value: '',
				});

				cy.get('input').focus();
				cy.get('input').type('9');
				cy.get('input').should('have.value', 9);
				cy.get('input').should('have.class', 'invalid');

				cy.get('input').clear();
				cy.get('input').type('10');
				cy.get('input').should('have.value', 10);
				cy.get('input').should('have.not.class', 'invalid');
			});
		});

		describe('Range', () => {
			it('should render arrows and work', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							range={true}
							min={-50}
							max={50}
						/>
					),
					name,
					value: 0,
				});

				cy.get('input[type=range]').setSliderValue(-20);
				cy.getByDataTest('range-control').should('have.value', '-20');
				cy.get('input[type=number]').should('have.value', -20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(-20);
				});

				// should set to -50 because -100 is smaller than min value
				cy.get('input[type=range]').setSliderValue(-100);
				cy.getByDataTest('range-control').should('have.value', '-50');
				cy.get('input[type=number]').should('have.value', -50);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(-50);
				});

				cy.get('input[type=range]').setSliderValue(20);
				cy.getByDataTest('range-control').should('have.value', '20');
				cy.get('input[type=number]').should('have.value', 20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(20);
				});

				// should set to 50 because 100 is smaller than min value
				cy.get('input[type=range]').setSliderValue(100);
				cy.getByDataTest('range-control').should('have.value', '50');
				cy.get('input[type=number]').should('have.value', 50);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(50);
				});
			});

			it('Disabled Range', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							range={true}
							disabled={true}
						/>
					),
					name,
					value: 0,
				});

				cy.get('input[type=number]').should('be.disabled');
				cy.get('input[type=range]').should(
					'have.css',
					'pointer-events',
					'none'
				);
			});
		});
	});

	describe('Unit Input', () => {
		describe('General', () => {
			it('empty value even after change', () => {
				const name = nanoid();

				cy.withDataProvider({
					component: <InputControl unitType="general" />,
					name,
					value: '',
				});

				cy.get('input').focus();
				cy.get('input').type(100);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('100px');
				});

				cy.get('input').clear();
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('');
				});
			});
		});

		describe('Units', () => {
			it('should change and handle units dropdown ', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl unitType="general" />,
					name,
				});

				cy.get('input').focus();
				cy.get('input').type(100);
				cy.get('[aria-label="Select Unit"]').select('px');
				cy.get('[aria-label="Select Unit"]').should('have.value', 'px');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('100px');
				});

				cy.get('input').focus();
				cy.get('input').clear();
				cy.get('input').type(50);
				cy.get('[aria-label="Select Unit"]').select('%');
				cy.get('[aria-label="Select Unit"]').should('have.value', '%');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('50%');
				});

				cy.get('input').focus();
				cy.get('input').clear();
				cy.get('input').type(30);
				cy.get('[aria-label="Select Unit"]').select('dvh');
				cy.get('[aria-label="Select Unit"]').should(
					'have.value',
					'dvh'
				);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('30dvh');
				});
			});

			it('extracted unit is not in list but should be appended to list and clear after change', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl unitType="general" />,
					name,
					value: '12XYZ',
				});

				cy.get('input').focus();
				cy.get('input').clear();
				cy.get('input').type(100);

				cy.get('[aria-label="Select Unit"]').contains('XYZ');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('100XYZ');
				});

				// by changing this the XYZ should be removed
				cy.get('[aria-label="Select Unit"]').select('px');
				cy.get('[aria-label="Select Unit"]').should('have.value', 'px');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('100px');
				});
				cy.get('[aria-label="Select Unit"]').should(
					'not.contain',
					'XYZ'
				);
			});

			it('disabled input', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl unitType="general" disabled={true} />
					),
					name,
					value: '12px',
				});

				cy.get('input[type=number]').should('be.disabled');
				cy.get('select').should('be.disabled');
			});

			it('handling data while switching between func, special and normal units', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl unitType="general" />,
					name,
					value: '12px',
				});

				// default value render
				cy.get('input').should('have.value', 12);
				cy.get('[aria-label="Select Unit"]').should('have.value', 'px');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('12px');
				});

				// change to func
				cy.get('[aria-label="Select Unit"]').select('func');
				cy.get('[aria-label="Select Unit"]').should(
					'have.value',
					'func'
				);
				cy.get('input').should('have.value', '12px');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('12pxfunc');
				});

				// change to em
				cy.get('[aria-label="Select Unit"]').select('em');
				cy.get('[aria-label="Select Unit"]').should('have.value', 'em');
				cy.get('input').should('have.value', 12);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('12em');
				});

				// change to initial
				cy.get('[aria-label="Select Unit"]').select('initial');
				cy.get('[aria-label="Select Unit"]').should(
					'have.value',
					'initial'
				);
				cy.get('input').should('not.exist');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('initial');
				});

				// change to ch
				cy.get('[aria-label="Select Unit"]').select('ch');
				cy.get('[aria-label="Select Unit"]').should('have.value', 'ch');
				cy.get('input').should('have.value', '');
				cy.get('input').focus();
				cy.get('input').type(12);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('12ch');
				});

				// change to initial
				cy.get('[aria-label="Select Unit"]').select('initial');
				cy.get('[aria-label="Select Unit"]').should(
					'have.value',
					'initial'
				);
				cy.get('input').should('not.exist');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('initial');
				});

				// change to func
				cy.get('[aria-label="Select Unit"]').select('func');
				cy.get('[aria-label="Select Unit"]').should(
					'have.value',
					'func'
				);
				cy.get('input').should('have.value', '');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('');
				});

				// change to px
				cy.get('[aria-label="Select Unit"]').select('px');
				cy.get('[aria-label="Select Unit"]').should('have.value', 'px');
				cy.get('input').should('have.value', '');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('');
				});

				// change to func
				cy.get('[aria-label="Select Unit"]').select('func');
				cy.get('[aria-label="Select Unit"]').should(
					'have.value',
					'func'
				);
				cy.get('input').should('have.value', '');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('');
				});
				cy.get('input').focus();
				cy.get('input').type('calc(11px)');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(
						'calc(11px)func'
					);
				});

				// change to px
				cy.get('[aria-label="Select Unit"]').select('px');
				cy.get('[aria-label="Select Unit"]').should('have.value', 'px');
				cy.get('input').should('have.value', '');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('');
				});
			});

			it('value is number and there is a unit with empty value', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: <InputControl unitType="line-height" />,
					name,
					value: '12',
				});

				// default value render
				cy.get('input').should('have.value', 12);
				cy.get('[aria-label="Select Unit"]').should('have.value', '');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('12');
				});

				// switch to px
				cy.get('[aria-label="Select Unit"]').select('px');
				cy.get('[aria-label="Select Unit"]').should('have.value', 'px');
				cy.get('input').should('have.value', '12');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('12px');
				});

				// switch to empty
				cy.get('[aria-label="Select Unit"]').select('');
				cy.get('[aria-label="Select Unit"]').should('have.value', '');
				cy.get('input').should('have.value', '12');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('12');
				});

				// switch to func
				cy.get('[aria-label="Select Unit"]').select('func');
				cy.get('[aria-label="Select Unit"]').should(
					'have.value',
					'func'
				);
				cy.get('input').should('have.value', '12');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('12func');
				});

				// switch to empty
				cy.get('[aria-label="Select Unit"]').select('');
				cy.get('[aria-label="Select Unit"]').should('have.value', '');
				cy.get('input').should('have.value', '');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('');
				});
			});
		});

		describe('Custom Units', () => {
			it('should render units', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							units={[
								{
									value: 'px',
									label: 'PX',
									default: 0,
									format: 'number',
								},
								{
									value: 'em',
									label: 'EM',
									default: 0,
									format: 'number',
								},
								{
									value: '%',
									label: '%',
									default: 0,
									format: 'number',
								},
								{
									value: 'XYZ',
									label: 'XYZ',
									default: 0,
									format: 'string',
								},
							]}
						/>
					),
					name,
					value: '0px',
				});

				cy.get('[aria-label="Select Unit"]').should('contain', 'PX');
				cy.get('[aria-label="Select Unit"]').should('contain', 'EM');
				cy.get('[aria-label="Select Unit"]').should('contain', '%');
				cy.get('[aria-label="Select Unit"]').should('contain', 'XYZ');
				cy.get('[aria-label="Select Unit"]').should(
					'not.contain',
					'Invalid'
				);
			});

			// todo this feature currently has not been implemented
			// it('custom unit with string format', () => {
			// 	const name = nanoid();
			// 	cy.withDataProvider({
			// 		component: (
			// 			<InputControl
			// 				type="number"
			// 				units={[
			// 					{
			// 						value: 'px',
			// 						label: 'PX',
			// 						format: 'number',
			// 					},
			// 					{
			// 						value: 'em',
			// 						label: 'EM',
			// 						format: 'number',
			// 					},
			// 					{
			// 						value: '%',
			// 						label: '%',
			// 						format: 'number',
			// 					},
			// 					{
			// 						value: 'XYZ',
			// 						label: 'XYZ',
			// 						format: 'string',
			// 					},
			// 				]}
			// 			/>
			// 		),
			// 		name,
			// 		value: '0px',
			// 	});
			//
			// 	// set special value
			// 	cy.get('[aria-label="Select Unit"]').select('XYZ');
			// 	cy.get('[aria-label="Select Unit"]').should(
			// 		'have.value',
			// 		'XYZ'
			// 	);
			// 	cy.then(() => {
			// 		return expect(getControlValue(name)).to.eq('0XYZ');
			// 	});
			// 	cy.get('input').should('have.value', 0);
			//
			// 	// change to custom unit and type string
			// 	cy.get('input').clear();
			// 	cy.get('input').focus();
			// 	cy.get('input').type('text value');
			// 	cy.get('input').should('have.value', 'text value');
			// 	cy.then(() => {
			// 		return expect(getControlValue(name)).to.eq('text valueXYZ');
			// 	});
			// });
		});

		describe('CSS Func Value', () => {
			it('should render and work', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl type="number" unitType="general" />
					),
					name,
					value: 'calc(1px + 1px)func',
				});

				// open editor
				cy.get('[aria-label="Open Editor"]').should('exist');
				cy.get('[aria-label="Open Editor"]').click();
				cy.get('textarea').should('exist');

				// change editor
				cy.get('textarea').clear();
				cy.get('textarea').type('min(10%, 100px)');
				cy.get('input[type=text]').should(
					'have.value',
					'min(10%, 100px)'
				);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(
						'min(10%, 100px)func'
					);
				});
			});

			it('disabled button', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl unitType="general" disabled={true} />
					),
					name,
					value: 'calc(1px + 1px)func',
				});

				cy.get('[aria-label="Open Editor"]').should('be.disabled');
			});

			it('small width input', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							unitType="general"
							size={true}
						/>
					),
					name,
					value: 'calc(1px + 1px)func',
				});

				// open editor
				cy.get('[aria-label="Open Editor"]').should('exist');
				cy.get('[aria-label="Open Editor"]').click();
				cy.get('textarea').should('exist');

				// change editor
				cy.get('textarea').clear();
				cy.get('textarea').type('min(10%, 100px)');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq(
						'min(10%, 100px)func'
					);
				});
			});
		});

		describe('Special Units', () => {
			it('select and deselect special units', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl type="number" unitType="general" />
					),
					name,
					value: '0px',
				});

				// set custom value
				cy.get('input').should('exist');
				cy.get('input').clear();
				cy.get('input').focus();
				cy.get('input').type('10');
				cy.get('input').should('have.value', 10);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('10px');
				});

				// set special value
				cy.get('[aria-label="Select Unit"]').select('auto', {
					force: true,
				});
				cy.get('[aria-label="Select Unit"]').should(
					'have.value',
					'auto'
				);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('auto');
				});
				cy.get('input').should('not.exist');

				// revert back to px and check the value should be 10
				cy.get('[aria-label="Select Unit"]').select('px');
				cy.get('[aria-label="Select Unit"]').should('have.value', 'px');
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('');
				});
				cy.get('input').should('exist');
			});
		});

		describe('Range', () => {
			it('should render arrows and work', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							unitType="general"
							range={true}
							min={-50}
							max={50}
						/>
					),
					name,
					value: '10px',
				});

				cy.get('input[type=range]').setSliderValue(-20);
				cy.getByDataTest('range-control').should('have.value', '-20');
				cy.get('input[type=number]').should('have.value', -20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('-20px');
				});

				// should set to -50 because -100 is smaller than min value
				cy.get('input[type=range]').setSliderValue(-100);
				cy.getByDataTest('range-control').should('have.value', '-50');
				cy.get('input[type=number]').should('have.value', -50);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('-50px');
				});

				cy.get('input[type=range]').setSliderValue(20);
				cy.getByDataTest('range-control').should('have.value', '20');
				cy.get('input[type=number]').should('have.value', 20);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('20px');
				});

				// should set to 50 because 100 is smaller than min value
				cy.get('input[type=range]').setSliderValue(100);
				cy.getByDataTest('range-control').should('have.value', '50');
				cy.get('input[type=number]').should('have.value', 50);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('50px');
				});
			});
		});

		describe('Arrows', () => {
			it('should render arrows and work', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							arrows={true}
							unitType="general"
						/>
					),
					name,
					value: '0px',
				});

				cy.getByDataTest('arrows-container').should('exist');

				cy.getByDataTest('arrow-up').click();
				cy.get('input').should('have.value', 1);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('1px');
				});

				cy.getByDataTest('arrow-down').click();
				cy.getByDataTest('arrow-down').click();
				cy.get('input').should('have.value', -1);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('-1px');
				});
			});

			it('check min and max', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							arrows={true}
							min={0}
							max={3}
							unitType="general"
						/>
					),
					name,
					value: '0px',
				});

				cy.getByDataTest('arrows-container').should('exist');

				cy.getByDataTest('arrow-up').click(); // 1
				cy.getByDataTest('arrow-up').click(); // 2
				cy.getByDataTest('arrow-up').click(); // 3
				cy.getByDataTest('arrow-up').should(
					'have.css',
					'pointer-events',
					'none'
				);
				cy.get('input').should('have.value', 3);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('3px');
				});

				cy.getByDataTest('arrow-down').click(); // 3
				cy.getByDataTest('arrow-down').click(); // 2
				cy.getByDataTest('arrow-down').click(); // 1
				cy.getByDataTest('arrow-down').should(
					'have.css',
					'pointer-events',
					'none'
				);
				cy.get('input').should('have.value', 0);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('0px');
				});

				cy.getByDataTest('arrow-up').click();
				cy.get('input').should('have.value', 1);
				cy.then(() => {
					return expect(getControlValue(name)).to.eq('1px');
				});
			});
		});

		describe('Validator', () => {
			it('validator works or not', () => {
				const name = nanoid();
				cy.withDataProvider({
					component: (
						<InputControl
							type="number"
							max={10}
							validator={(value) => {
								return value === '10px';
							}}
							unitType="general"
						/>
					),
					name,
					value: '',
				});

				cy.get('input').type('9');
				cy.get('input').should('have.value', 9);
				cy.get('input').should('have.class', 'invalid');

				cy.get('input').clear();
				cy.get('input').type('10');
				cy.get('input').should('have.value', 10);
				cy.get('input').should('have.not.class', 'invalid');
			});
		});
	});
});
