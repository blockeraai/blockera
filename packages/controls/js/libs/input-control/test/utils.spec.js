/**
 * Internal dependencies
 */
import {
	isSpecialUnit,
	getCSSUnits,
	getUnitByValue,
	extractNumberAndUnit,
	getFirstUnit,
} from '../utils';

describe('Util functions', () => {
	describe('isSpecialUnit', () => {
		test('1px', () => {
			expect(isSpecialUnit('1px')).toBe(false);
		});

		test('auto', () => {
			expect(isSpecialUnit('auto')).toBe(true);
		});

		test('initial', () => {
			expect(isSpecialUnit('initial')).toBe(true);
		});

		test('inherit', () => {
			expect(isSpecialUnit('inherit')).toBe(true);
		});

		test('fit-content', () => {
			expect(isSpecialUnit('fit-content')).toBe(true);
		});

		test('max-content', () => {
			expect(isSpecialUnit('max-content')).toBe(true);
		});

		test('min-content', () => {
			expect(isSpecialUnit('min-content')).toBe(true);
		});

		test('unset', () => {
			expect(isSpecialUnit('unset')).toBe(true);
		});

		test('revert-layer', () => {
			expect(isSpecialUnit('revert-layer')).toBe(true);
		});

		test('revert', () => {
			expect(isSpecialUnit('revert')).toBe(true);
		});

		test('content', () => {
			expect(isSpecialUnit('content')).toBe(true);
		});

		test('false', () => {
			expect(isSpecialUnit('false')).toBe(false);
		});

		test('calc(12px + 12px)func', () => {
			expect(isSpecialUnit('calc(12px + 12px)func')).toBe(false);
		});

		test('none', () => {
			expect(isSpecialUnit('none')).toBe(true);
		});

		test('stretch', () => {
			expect(isSpecialUnit('stretch')).toBe(true);
		});

		test('func suffix should not be special unit - autofunc', () => {
			expect(isSpecialUnit('autofunc')).toBe(false);
		});

		test('func suffix should not be special unit - initialfunc', () => {
			expect(isSpecialUnit('initialfunc')).toBe(false);
		});

		test('func suffix should not be special unit - inheritfunc', () => {
			expect(isSpecialUnit('inheritfunc')).toBe(false);
		});

		test('func suffix should not be special unit - stretchfunc', () => {
			expect(isSpecialUnit('stretchfunc')).toBe(false);
		});

		test('func suffix should not be special unit - fit-contentfunc', () => {
			expect(isSpecialUnit('fit-contentfunc')).toBe(false);
		});

		test('func suffix should not be special unit - max-contentfunc', () => {
			expect(isSpecialUnit('max-contentfunc')).toBe(false);
		});

		test('func suffix should not be special unit - min-contentfunc', () => {
			expect(isSpecialUnit('min-contentfunc')).toBe(false);
		});

		test('func suffix should not be special unit - unsetfunc', () => {
			expect(isSpecialUnit('unsetfunc')).toBe(false);
		});

		test('func suffix should not be special unit - revert-layerfunc', () => {
			expect(isSpecialUnit('revert-layerfunc')).toBe(false);
		});

		test('func suffix should not be special unit - revertfunc', () => {
			expect(isSpecialUnit('revertfunc')).toBe(false);
		});

		test('func suffix should not be special unit - contentfunc', () => {
			expect(isSpecialUnit('contentfunc')).toBe(false);
		});

		test('func suffix should not be special unit - nonefunc', () => {
			expect(isSpecialUnit('nonefunc')).toBe(false);
		});

		test('non-string values - null', () => {
			expect(isSpecialUnit(null)).toBe(false);
		});

		test('non-string values - undefined', () => {
			expect(isSpecialUnit(undefined)).toBe(false);
		});

		test('non-string values - number', () => {
			expect(isSpecialUnit(123)).toBe(false);
		});

		test('non-string values - object', () => {
			expect(isSpecialUnit({})).toBe(false);
		});

		test('non-string values - array', () => {
			expect(isSpecialUnit([])).toBe(false);
		});

		test('empty string', () => {
			expect(isSpecialUnit('')).toBe(false);
		});

		test('value containing special unit but not ending with it', () => {
			expect(isSpecialUnit('auto-value')).toBe(false);
		});

		test('value containing special unit but not ending with it - inherit-test', () => {
			expect(isSpecialUnit('inherit-test')).toBe(false);
		});

		test('value containing special unit but not ending with it - initial123', () => {
			expect(isSpecialUnit('initial123')).toBe(false);
		});
	});

	describe('getCSSUnits', () => {
		test('no param', () => {
			expect(getCSSUnits()).toStrictEqual([]);
		});

		test('empty', () => {
			expect(getCSSUnits('')).toStrictEqual([]);
		});

		test('wrong value', () => {
			expect(getCSSUnits('akbar')).toStrictEqual([]);
		});

		test('wrong value 2', () => {
			expect(getCSSUnits(['general'])).toStrictEqual([]);
		});

		test('general', () => {
			expect(getCSSUnits('general')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'auto',
							label: 'Auto',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('essential', () => {
			expect(getCSSUnits('essential')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('margin', () => {
			expect(getCSSUnits('margin')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'auto',
							label: 'Auto',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('padding', () => {
			expect(getCSSUnits('padding')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('width', () => {
			expect(getCSSUnits('width')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'stretch',
							label: 'Fill Available Space',
							format: 'number',
						},
						{
							value: 'fit-content',
							label: 'Fit Content',
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							format: 'number',
						},
						{
							value: 'auto',
							label: 'Auto',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('height', () => {
			expect(getCSSUnits('height')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'stretch',
							label: 'Fill Available Space',
							format: 'number',
						},
						{
							value: 'fit-content',
							label: 'Fit Content',
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							format: 'number',
						},
						{
							value: 'auto',
							label: 'Auto',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('min-width', () => {
			expect(getCSSUnits('min-width')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'stretch',
							label: 'Fill Available Space',
							format: 'number',
						},
						{
							value: 'fit-content',
							label: 'Fit Content',
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('min-height', () => {
			expect(getCSSUnits('min-height')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'stretch',
							label: 'Fill Available Space',
							format: 'number',
						},
						{
							value: 'fit-content',
							label: 'Fit Content',
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('max-width', () => {
			expect(getCSSUnits('max-width')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'stretch',
							label: 'Fill Available Space',
							format: 'number',
						},
						{
							value: 'fit-content',
							label: 'Fit Content',
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							format: 'number',
						},
						{
							value: 'none',
							label: 'None',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('max-height', () => {
			expect(getCSSUnits('max-height')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'stretch',
							label: 'Fill Available Space',
							format: 'number',
						},
						{
							value: 'fit-content',
							label: 'Fit Content',
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							format: 'number',
						},
						{
							value: 'none',
							label: 'None',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('percent', () => {
			expect(getCSSUnits('percent')).toStrictEqual([
				{ value: '%', label: '%', format: 'number' },
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('angle', () => {
			expect(getCSSUnits('angle')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'deg',
							label: 'DEG',
							format: 'number',
						},
						{
							value: 'rad',
							label: 'RAD',
							format: 'number',
						},
						{
							value: 'grad',
							label: 'GRAD',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('duration', () => {
			expect(getCSSUnits('duration')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'ms',
							label: 'MS',
							format: 'number',
						},
						{
							value: 's',
							label: 'S',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('background-position', () => {
			expect(getCSSUnits('background-position')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('text-indent', () => {
			expect(getCSSUnits('text-indent')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'inherit',
							label: 'Inherit',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('letter-spacing', () => {
			expect(getCSSUnits('letter-spacing')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'normal',
							label: 'Normal',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('background-size', () => {
			expect(getCSSUnits('background-size')).toStrictEqual([
				{
					label: 'Special Values',
					options: [
						{
							value: 'auto',
							label: 'Auto',
							format: 'text',
						},
					],
				},
				{
					label: 'Common Values',
					options: [
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('box-shadow', () => {
			expect(getCSSUnits('box-shadow')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('text-shadow', () => {
			expect(getCSSUnits('text-shadow')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('outline', () => {
			expect(getCSSUnits('outline')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('order', () => {
			expect(getCSSUnits('order')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '—',
							format: 'number',
						},
						{
							value: 'ps',
							label: 'ps',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'revert',
							label: 'Revert',
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('flex-basis', () => {
			expect(getCSSUnits('flex-basis')).toStrictEqual([
				{
					label: 'Special Values',
					options: [
						{
							value: 'auto',
							label: 'Auto',
							format: 'text',
						},
						{
							value: 'content',
							label: 'Content',
							format: 'text',
						},
					],
				},
				{
					label: 'Common Values',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('flex-shrink', () => {
			expect(getCSSUnits('flex-shrink')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '—',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'revert',
							label: 'Revert',
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('flex-grow', () => {
			expect(getCSSUnits('flex-grow')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '—',
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'revert',
							label: 'Revert',
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
							format: 'text',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('z-index', () => {
			expect(getCSSUnits('z-index')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '—',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('media-query', () => {
			expect(getCSSUnits('media-query')).toStrictEqual([
				{
					label: 'Common Value',
					options: [
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions',
							format: 'text',
						},
					],
				},
			]);
		});

		test('line-height', () => {
			expect(getCSSUnits('line-height')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '—',
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
							format: 'number',
						},
						{
							value: '%',
							label: '%',
							format: 'number',
						},
						{
							value: 'em',
							label: 'EM',
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							format: 'number',
						},
					],
				},
				{
					label: 'Other Values',
					options: [
						{
							value: 'ch',
							label: 'CH',
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							format: 'number',
						},
					],
				},
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							format: 'text',
						},
					],
				},
			]);
		});

		test('text-length', () => {
			expect(getCSSUnits('text-length')).toStrictEqual([
				{
					value: 'chars',
					label: 'Chars',
					format: 'number',
				},
				{
					value: 'words',
					label: 'Words',
					format: 'number',
				},
			]);
		});
	});

	describe('getUnitByValue', () => {
		test('no param', () => {
			expect(getUnitByValue()).toStrictEqual({});
		});

		test('empty value', () => {
			expect(getUnitByValue('')).toStrictEqual({});
		});

		test('value but empty unit ', () => {
			expect(getUnitByValue('px')).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
				notFound: true,
			});
		});

		test('value and units - simple - first item', () => {
			expect(
				getUnitByValue('px', [
					{
						value: 'px',
						label: 'PX',
						format: 'number',
					},
					{
						value: 'em',
						label: 'EM',
						format: 'number',
					},
					{
						value: 'rem',
						label: 'REM',
						format: 'number',
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
			});
		});

		test('value and units - simple - second item', () => {
			expect(
				getUnitByValue('em', [
					{
						value: 'px',
						label: 'PX',
						format: 'number',
					},
					{
						value: 'em',
						label: 'EM',
						format: 'number',
					},
					{
						value: 'rem',
						label: 'REM',
						format: 'number',
					},
				])
			).toStrictEqual({
				value: 'em',
				label: 'EM',
				format: 'number',
			});
		});

		test('value and units - complex - first item', () => {
			expect(
				getUnitByValue('px', [
					{
						label: 'Common Values',
						options: [
							{
								value: 'px',
								label: 'PX',
								format: 'number',
							},
							{
								value: 'em',
								label: 'EM',
								format: 'number',
							},
							{
								value: 'rem',
								label: 'REM',
								format: 'number',
							},
						],
					},
					{
						label: 'Other Values',
						options: [
							{
								value: 'ch',
								label: 'CH',
								format: 'number',
							},
							{
								value: 'vw',
								label: 'VW',
								format: 'number',
							},
							{
								value: 'vh',
								label: 'VH',
								format: 'number',
							},
							{
								value: 'dvw',
								label: 'DVW',
								format: 'number',
							},
							{
								value: 'dvh',
								label: 'DVH',
								format: 'number',
							},
						],
					},
					{
						label: 'Advanced',
						options: [
							{
								value: 'func',
								label: 'CSS Functions and Variables',
								format: 'text',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
			});
		});

		test('value and units - complex - middle item', () => {
			expect(
				getUnitByValue('dvh', [
					{
						label: 'Common Values',
						options: [
							{
								value: 'px',
								label: 'PX',
								format: 'number',
							},
							{
								value: 'em',
								label: 'EM',
								format: 'number',
							},
							{
								value: 'rem',
								label: 'REM',
								format: 'number',
							},
						],
					},
					{
						label: 'Other Values',
						options: [
							{
								value: 'ch',
								label: 'CH',
								format: 'number',
							},
							{
								value: 'vw',
								label: 'VW',
								format: 'number',
							},
							{
								value: 'vh',
								label: 'VH',
								format: 'number',
							},
							{
								value: 'dvw',
								label: 'DVW',
								format: 'number',
							},
							{
								value: 'dvh',
								label: 'DVH',
								format: 'number',
							},
						],
					},
					{
						label: 'Advanced',
						options: [
							{
								value: 'func',
								label: 'CSS Functions and Variables',
								format: 'text',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'dvh',
				label: 'DVH',
				format: 'number',
			});
		});

		test('value is empty but there is a unit with value of empty!', () => {
			expect(getUnitByValue('', getCSSUnits('z-index'))).toStrictEqual({
				value: '',
				label: '—',
				format: 'number',
			});
		});

		test('value and units - complex - last item', () => {
			expect(
				getUnitByValue('func', [
					{
						label: 'Common Values',
						options: [
							{
								value: 'px',
								label: 'PX',
								format: 'number',
							},
						],
					},
					{
						label: 'Advanced',
						options: [
							{
								value: 'func',
								label: 'CSS Functions and Variables',
								format: 'text',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'func',
				label: 'CSS Functions and Variables',
				format: 'text',
			});
		});

		test('value not found in units array', () => {
			expect(
				getUnitByValue('xyz', [
					{
						value: 'px',
						label: 'PX',
						format: 'number',
					},
					{
						value: 'em',
						label: 'EM',
						format: 'number',
					},
				])
			).toStrictEqual({
				value: 'xyz',
				label: 'XYZ',
				format: 'number',
				notFound: true,
			});
		});

		test('value not found in complex units array', () => {
			expect(
				getUnitByValue('xyz', [
					{
						label: 'Common Values',
						options: [
							{
								value: 'px',
								label: 'PX',
								format: 'number',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'xyz',
				label: 'XYZ',
				format: 'number',
				notFound: true,
			});
		});

		test('units is not an array', () => {
			expect(getUnitByValue('px', null)).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
				notFound: true,
			});
		});

		test('units is not an array - object', () => {
			expect(getUnitByValue('px', {})).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
				notFound: true,
			});
		});

		test('units is empty array', () => {
			expect(getUnitByValue('px', [])).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
				notFound: true,
			});
		});

		test('value found in deeply nested options', () => {
			expect(
				getUnitByValue('dvh', [
					{
						label: 'Level 1',
						options: [
							{
								label: 'Level 2',
								options: [
									{
										value: 'dvh',
										label: 'DVH',
										format: 'number',
									},
								],
							},
						],
					},
				])
			).toStrictEqual({
				value: 'dvh',
				label: 'DVH',
				format: 'number',
			});
		});

		test('value with empty string in nested options', () => {
			expect(
				getUnitByValue('', [
					{
						label: 'Common Values',
						options: [
							{
								value: '',
								label: '—',
								format: 'number',
							},
							{
								value: 'px',
								label: 'PX',
								format: 'number',
							},
						],
					},
				])
			).toStrictEqual({
				value: '',
				label: '—',
				format: 'number',
			});
		});
	});

	describe('extractNumberAndUnit', () => {
		describe('General', () => {
			test('no param', () => {
				expect(extractNumberAndUnit()).toStrictEqual({
					value: '',
					unit: '',
				});
			});

			test('empty', () => {
				expect(extractNumberAndUnit('')).toStrictEqual({
					value: '',
					unit: '',
				});
			});

			test('invalid value', () => {
				expect(extractNumberAndUnit('invalid')).toStrictEqual({
					value: 'invalid',
					unit: 'func',
					unitSimulated: true,
				});
			});
		});

		describe('object value', () => {
			test('valid object', () => {
				expect(
					extractNumberAndUnit({ value: '12', unit: 'px' })
				).toStrictEqual({
					value: '12',
					unit: 'px',
				});
			});

			test('invalid object', () => {
				expect(extractNumberAndUnit({ noValue: '' })).toStrictEqual({
					value: '',
					unit: '',
				});
			});

			test('object missing unit', () => {
				expect(extractNumberAndUnit({ value: '12' })).toStrictEqual({
					value: '12',
					unit: '',
				});
			});

			test('object missing value', () => {
				expect(extractNumberAndUnit({ unit: 'px' })).toStrictEqual({
					value: '',
					unit: 'px',
				});
			});

			test('object with empty value', () => {
				expect(
					extractNumberAndUnit({ value: '', unit: 'px' })
				).toStrictEqual({
					value: '',
					unit: 'px',
				});
			});

			test('object with empty unit', () => {
				expect(
					extractNumberAndUnit({ value: '12', unit: '' })
				).toStrictEqual({
					value: '12',
					unit: '',
				});
			});

			test('object with both empty', () => {
				expect(
					extractNumberAndUnit({ value: '', unit: '' })
				).toStrictEqual({
					value: '',
					unit: '',
				});
			});

			test('object with null value', () => {
				expect(
					extractNumberAndUnit({ value: null, unit: 'px' })
				).toStrictEqual({
					value: '',
					unit: 'px',
				});
			});

			test('object with null unit', () => {
				expect(
					extractNumberAndUnit({ value: '12', unit: null })
				).toStrictEqual({
					value: '12',
					unit: '',
				});
			});

			test('object with undefined value', () => {
				expect(
					extractNumberAndUnit({ value: undefined, unit: 'px' })
				).toStrictEqual({
					value: '',
					unit: 'px',
				});
			});

			test('object with undefined unit', () => {
				expect(
					extractNumberAndUnit({ value: '12', unit: undefined })
				).toStrictEqual({
					value: '12',
					unit: '',
				});
			});

			test('object with special unit value', () => {
				expect(
					extractNumberAndUnit({ value: '', unit: 'auto' })
				).toStrictEqual({
					value: '',
					unit: 'auto',
				});
			});
		});

		describe('special value', () => {
			test('auto', () => {
				expect(extractNumberAndUnit('auto')).toStrictEqual({
					value: '',
					unit: 'auto',
					specialUnit: true,
				});
			});

			test('inherit', () => {
				expect(extractNumberAndUnit('inherit')).toStrictEqual({
					value: '',
					unit: 'inherit',
					specialUnit: true,
				});
			});

			test('initial', () => {
				expect(extractNumberAndUnit('initial')).toStrictEqual({
					value: '',
					unit: 'initial',
					specialUnit: true,
				});
			});

			test('none', () => {
				expect(extractNumberAndUnit('none')).toStrictEqual({
					value: '',
					unit: 'none',
					specialUnit: true,
				});
			});

			test('stretch', () => {
				expect(extractNumberAndUnit('stretch')).toStrictEqual({
					value: '',
					unit: 'stretch',
					specialUnit: true,
				});
			});

			test('fit-content', () => {
				expect(extractNumberAndUnit('fit-content')).toStrictEqual({
					value: '',
					unit: 'fit-content',
					specialUnit: true,
				});
			});

			test('max-content', () => {
				expect(extractNumberAndUnit('max-content')).toStrictEqual({
					value: '',
					unit: 'max-content',
					specialUnit: true,
				});
			});

			test('min-content', () => {
				expect(extractNumberAndUnit('min-content')).toStrictEqual({
					value: '',
					unit: 'min-content',
					specialUnit: true,
				});
			});

			test('unset', () => {
				expect(extractNumberAndUnit('unset')).toStrictEqual({
					value: '',
					unit: 'unset',
					specialUnit: true,
				});
			});

			test('revert-layer', () => {
				expect(extractNumberAndUnit('revert-layer')).toStrictEqual({
					value: '',
					unit: 'revert-layer',
					specialUnit: true,
				});
			});

			test('revert', () => {
				expect(extractNumberAndUnit('revert')).toStrictEqual({
					value: '',
					unit: 'revert',
					specialUnit: true,
				});
			});

			test('content', () => {
				expect(extractNumberAndUnit('content')).toStrictEqual({
					value: '',
					unit: 'content',
					specialUnit: true,
				});
			});
		});

		describe('css unit values', () => {
			test('12px', () => {
				expect(extractNumberAndUnit('12px')).toStrictEqual({
					value: 12,
					unit: 'px',
				});
			});

			test('1.2px', () => {
				expect(extractNumberAndUnit('1.2px')).toStrictEqual({
					value: 1.2,
					unit: 'px',
				});
			});

			test('-1.2px', () => {
				expect(extractNumberAndUnit('-1.2px')).toStrictEqual({
					value: -1.2,
					unit: 'px',
				});
			});

			test('-1.2%', () => {
				expect(extractNumberAndUnit('-1.2%')).toStrictEqual({
					value: -1.2,
					unit: '%',
				});
			});

			test('0px', () => {
				expect(extractNumberAndUnit('0px')).toStrictEqual({
					value: 0,
					unit: 'px',
				});
			});

			test('0%', () => {
				expect(extractNumberAndUnit('0%')).toStrictEqual({
					value: 0,
					unit: '%',
				});
			});

			test('0', () => {
				expect(extractNumberAndUnit('0')).toStrictEqual({
					value: 0,
					unit: 'func',
					unitSimulated: true,
				});
			});

			test('12em', () => {
				expect(extractNumberAndUnit('12em')).toStrictEqual({
					value: 12,
					unit: 'em',
				});
			});

			test('12rem', () => {
				expect(extractNumberAndUnit('12rem')).toStrictEqual({
					value: 12,
					unit: 'rem',
				});
			});

			test('12ch', () => {
				expect(extractNumberAndUnit('12ch')).toStrictEqual({
					value: 12,
					unit: 'ch',
				});
			});

			test('12vw', () => {
				expect(extractNumberAndUnit('12vw')).toStrictEqual({
					value: 12,
					unit: 'vw',
				});
			});

			test('12vh', () => {
				expect(extractNumberAndUnit('12vh')).toStrictEqual({
					value: 12,
					unit: 'vh',
				});
			});

			test('12dvw', () => {
				expect(extractNumberAndUnit('12dvw')).toStrictEqual({
					value: 12,
					unit: 'dvw',
				});
			});

			test('12dvh', () => {
				expect(extractNumberAndUnit('12dvh')).toStrictEqual({
					value: 12,
					unit: 'dvh',
				});
			});

			test('12deg', () => {
				expect(extractNumberAndUnit('12deg')).toStrictEqual({
					value: 12,
					unit: 'deg',
				});
			});

			test('12rad', () => {
				expect(extractNumberAndUnit('12rad')).toStrictEqual({
					value: 12,
					unit: 'rad',
				});
			});

			test('12ms', () => {
				expect(extractNumberAndUnit('12ms')).toStrictEqual({
					value: 12,
					unit: 'ms',
				});
			});

			test('12s', () => {
				expect(extractNumberAndUnit('12s')).toStrictEqual({
					value: 12,
					unit: 's',
				});
			});

			test('very large number', () => {
				expect(extractNumberAndUnit('999999px')).toStrictEqual({
					value: 999999,
					unit: 'px',
				});
			});

			test('very small decimal', () => {
				expect(extractNumberAndUnit('0.0001px')).toStrictEqual({
					value: 0.0001,
					unit: 'px',
				});
			});

			test('value with spaces before unit', () => {
				expect(extractNumberAndUnit('12 px')).toStrictEqual({
					value: 12,
					unit: 'px',
				});
			});

			test('value with multiple spaces', () => {
				expect(extractNumberAndUnit('12   px')).toStrictEqual({
					value: 12,
					unit: 'px',
				});
			});
		});

		describe('func value', () => {
			test('12', () => {
				expect(extractNumberAndUnit(12)).toStrictEqual({
					value: 12,
					unit: 'func',
					unitSimulated: true,
				});
			});

			test('12func', () => {
				expect(extractNumberAndUnit('12func')).toStrictEqual({
					value: '12',
					unit: 'func',
				});
			});

			test('12pxfunc', () => {
				expect(extractNumberAndUnit('12pxfunc')).toStrictEqual({
					value: '12px',
					unit: 'func',
				});
			});

			test('12%func', () => {
				expect(extractNumberAndUnit('12%func')).toStrictEqual({
					value: '12%',
					unit: 'func',
				});
			});

			test('12.2%func', () => {
				expect(extractNumberAndUnit('12.2%func')).toStrictEqual({
					value: '12.2%',
					unit: 'func',
				});
			});

			test('-12.2%func', () => {
				expect(extractNumberAndUnit('-12.2%func')).toStrictEqual({
					value: '-12.2%',
					unit: 'func',
				});
			});

			test('calc(12px + 12px)func', () => {
				expect(
					extractNumberAndUnit('calc(12px + 12px)func')
				).toStrictEqual({
					value: 'calc(12px + 12px)',
					unit: 'func',
				});
			});

			test('inheritfunc', () => {
				expect(extractNumberAndUnit('inheritfunc')).toStrictEqual({
					value: 'inherit',
					unit: 'func',
				});
			});

			test('initialfunc', () => {
				expect(extractNumberAndUnit('initialfunc')).toStrictEqual({
					value: 'initial',
					unit: 'func',
				});
			});

			test('autofunc', () => {
				expect(extractNumberAndUnit('autofunc')).toStrictEqual({
					value: 'auto',
					unit: 'func',
				});
			});

			test('nonefunc', () => {
				expect(extractNumberAndUnit('nonefunc')).toStrictEqual({
					value: 'none',
					unit: 'func',
				});
			});

			test('stretchfunc', () => {
				expect(extractNumberAndUnit('stretchfunc')).toStrictEqual({
					value: 'stretch',
					unit: 'func',
				});
			});

			test('fit-contentfunc', () => {
				expect(extractNumberAndUnit('fit-contentfunc')).toStrictEqual({
					value: 'fit-content',
					unit: 'func',
				});
			});

			test('max-contentfunc', () => {
				expect(extractNumberAndUnit('max-contentfunc')).toStrictEqual({
					value: 'max-content',
					unit: 'func',
				});
			});

			test('min-contentfunc', () => {
				expect(extractNumberAndUnit('min-contentfunc')).toStrictEqual({
					value: 'min-content',
					unit: 'func',
				});
			});

			test('unsetfunc', () => {
				expect(extractNumberAndUnit('unsetfunc')).toStrictEqual({
					value: 'unset',
					unit: 'func',
				});
			});

			test('revert-layerfunc', () => {
				expect(extractNumberAndUnit('revert-layerfunc')).toStrictEqual({
					value: 'revert-layer',
					unit: 'func',
				});
			});

			test('revertfunc', () => {
				expect(extractNumberAndUnit('revertfunc')).toStrictEqual({
					value: 'revert',
					unit: 'func',
				});
			});

			test('contentfunc', () => {
				expect(extractNumberAndUnit('contentfunc')).toStrictEqual({
					value: 'content',
					unit: 'func',
				});
			});

			test('var(--custom-var)func', () => {
				expect(
					extractNumberAndUnit('var(--custom-var)func')
				).toStrictEqual({
					value: 'var(--custom-var)',
					unit: 'func',
				});
			});

			test('min(100px, 50%)func', () => {
				expect(
					extractNumberAndUnit('min(100px, 50%)func')
				).toStrictEqual({
					value: 'min(100px, 50%)',
					unit: 'func',
				});
			});

			test('max(100px, 50%)func', () => {
				expect(
					extractNumberAndUnit('max(100px, 50%)func')
				).toStrictEqual({
					value: 'max(100px, 50%)',
					unit: 'func',
				});
			});

			test('clamp(10px, 5vw, 20px)func', () => {
				expect(
					extractNumberAndUnit('clamp(10px, 5vw, 20px)func')
				).toStrictEqual({
					value: 'clamp(10px, 5vw, 20px)',
					unit: 'func',
				});
			});

			test('calc(100% - 20px)func', () => {
				expect(
					extractNumberAndUnit('calc(100% - 20px)func')
				).toStrictEqual({
					value: 'calc(100% - 20px)',
					unit: 'func',
				});
			});

			test('calc(12px * 2)func', () => {
				expect(
					extractNumberAndUnit('calc(12px * 2)func')
				).toStrictEqual({
					value: 'calc(12px * 2)',
					unit: 'func',
				});
			});

			test('calc(12px / 2)func', () => {
				expect(
					extractNumberAndUnit('calc(12px / 2)func')
				).toStrictEqual({
					value: 'calc(12px / 2)',
					unit: 'func',
				});
			});
		});
	});

	describe('getFirstUnit', () => {
		test('no param', () => {
			expect(getFirstUnit()).toStrictEqual({});
		});

		test('empty', () => {
			expect(getFirstUnit([])).toStrictEqual({});
		});

		test('simple array', () => {
			expect(
				getFirstUnit([
					{
						value: 'px',
						label: 'PX',
						format: 'number',
					},
					{
						value: 'em',
						label: 'EM',
						format: 'number',
					},
					{
						value: 'rem',
						label: 'REM',
						format: 'number',
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
			});
		});

		test('complex array', () => {
			expect(
				getFirstUnit([
					{
						label: 'Common Values',
						options: [
							{
								value: 'px',
								label: 'PX',
								format: 'number',
							},
							{
								value: 'em',
								label: 'EM',
								format: 'number',
							},
							{
								value: 'rem',
								label: 'REM',
								format: 'number',
							},
						],
					},
					{
						label: 'Other Values',
						options: [
							{
								value: 'ch',
								label: 'CH',
								format: 'number',
							},
							{
								value: 'vw',
								label: 'VW',
								format: 'number',
							},
							{
								value: 'vh',
								label: 'VH',
								format: 'number',
							},
							{
								value: 'dvw',
								label: 'DVW',
								format: 'number',
							},
							{
								value: 'dvh',
								label: 'DVH',
								format: 'number',
							},
						],
					},
					{
						label: 'Advanced',
						options: [
							{
								value: 'func',
								label: 'CSS Functions and Variables',
								format: 'text',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
			});
		});

		test('array with empty options', () => {
			expect(
				getFirstUnit([
					{
						label: 'Empty Options',
						options: [],
					},
					{
						value: 'px',
						label: 'PX',
						format: 'number',
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
			});
		});

		test('array with first item having empty options', () => {
			expect(
				getFirstUnit([
					{
						label: 'Empty Options',
						options: [],
					},
					{
						label: 'Common Values',
						options: [
							{
								value: 'px',
								label: 'PX',
								format: 'number',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
			});
		});

		test('array with null first item', () => {
			expect(
				getFirstUnit([
					null,
					{ value: 'px', label: 'PX', format: 'number' },
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
			});
		});

		test('array with undefined first item', () => {
			expect(
				getFirstUnit([
					undefined,
					{ value: 'px', label: 'PX', format: 'number' },
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
			});
		});

		test('array with all items having empty options', () => {
			expect(
				getFirstUnit([
					{
						label: 'Empty Options 1',
						options: [],
					},
					{
						label: 'Empty Options 2',
						options: [],
					},
				])
			).toStrictEqual({});
		});

		test('array with mixed structure - simple item first', () => {
			expect(
				getFirstUnit([
					{
						value: 'px',
						label: 'PX',
						format: 'number',
					},
					{
						label: 'Common Values',
						options: [
							{
								value: 'em',
								label: 'EM',
								format: 'number',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				format: 'number',
			});
		});
	});
});
