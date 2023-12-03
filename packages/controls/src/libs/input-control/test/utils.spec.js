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
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
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
							default: '',
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
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
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
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
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
							default: '',
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
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
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
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
							format: 'number',
						},
					],
				},
				{
					label: 'Special Values',
					options: [
						{
							value: 'fit-content',
							label: 'Fit Content',
							default: 0,
							format: 'number',
						},
						{
							value: 'max-content',
							label: 'Max Content',
							default: 0,
							format: 'number',
						},
						{
							value: 'min-content',
							label: 'Min Content',
							default: 0,
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
							default: '',
							format: 'text',
						},
					],
				},
			]);
		});

		test('percent', () => {
			expect(getCSSUnits('percent')).toStrictEqual([
				{ value: '%', label: '%', default: 0, format: 'number' },
				{
					label: 'Advanced',
					options: [
						{
							value: 'func',
							label: 'CSS Functions and Variables',
							default: '',
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
							default: 0,
							format: 'number',
						},
						{
							value: 'rad',
							label: 'RAD',
							default: 0,
							format: 'number',
						},
						{
							value: 'grad',
							label: 'GRAD',
							default: 0,
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
							default: '',
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
							default: 0,
							format: 'number',
						},
						{
							value: 's',
							label: 'S',
							default: 1,
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
							default: '',
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
							default: 0,
							format: 'number',
						},
						{
							value: 'px',
							label: 'PX',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
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
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
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
							default: '',
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
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
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
							default: '',
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
							default: '',
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
							default: 0,
							format: 'number',
						},
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
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
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
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
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
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
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
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
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
							label: '-',
							default: '',
							format: 'number',
						},
						{
							value: 'ps',
							label: 'ps',
							default: '',
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
							default: '',
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							default: '',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
							default: '',
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
							default: '',
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
							default: '',
							format: 'text',
						},
						{
							value: 'content',
							label: 'Content',
							default: '',
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
							value: 'em',
							label: 'EM',
							default: 0,
							format: 'number',
						},
						{
							value: 'rem',
							label: 'REM',
							default: 0,
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
							default: 0,
							format: 'number',
						},
						{
							value: 'vw',
							label: 'VW',
							default: 0,
							format: 'number',
						},
						{
							value: 'vh',
							label: 'VH',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvw',
							label: 'DVW',
							default: 0,
							format: 'number',
						},
						{
							value: 'dvh',
							label: 'DVH',
							default: 0,
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
							default: '',
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
							label: '-',
							default: '',
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
							default: '',
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							default: '',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
							default: '',
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
							default: '',
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
							label: '-',
							default: '',
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
							default: '',
							format: 'text',
						},
						{
							value: 'revert-layer',
							label: 'Revert Layer',
							default: '',
							format: 'text',
						},
						{
							value: 'inherit',
							label: 'Inherit',
							default: '',
							format: 'text',
						},
						{
							value: 'initial',
							label: 'Initial',
							default: '',
							format: 'text',
						},
						{
							value: 'unset',
							label: 'Unset',
							default: '',
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
							default: '',
							format: 'text',
						},
					],
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
				default: '',
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
						value: 'rem',
						label: 'REM',
						default: 0,
						format: 'number',
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				default: 0,
				format: 'number',
			});
		});

		test('value and units - simple - second item', () => {
			expect(
				getUnitByValue('em', [
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
						value: 'rem',
						label: 'REM',
						default: 0,
						format: 'number',
					},
				])
			).toStrictEqual({
				value: 'em',
				label: 'EM',
				default: 0,
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
								value: 'rem',
								label: 'REM',
								default: 0,
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
								default: 0,
								format: 'number',
							},
							{
								value: 'vw',
								label: 'VW',
								default: 0,
								format: 'number',
							},
							{
								value: 'vh',
								label: 'VH',
								default: 0,
								format: 'number',
							},
							{
								value: 'dvw',
								label: 'DVW',
								default: 0,
								format: 'number',
							},
							{
								value: 'dvh',
								label: 'DVH',
								default: 0,
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
								default: '',
								format: 'text',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				default: 0,
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
								value: 'rem',
								label: 'REM',
								default: 0,
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
								default: 0,
								format: 'number',
							},
							{
								value: 'vw',
								label: 'VW',
								default: 0,
								format: 'number',
							},
							{
								value: 'vh',
								label: 'VH',
								default: 0,
								format: 'number',
							},
							{
								value: 'dvw',
								label: 'DVW',
								default: 0,
								format: 'number',
							},
							{
								value: 'dvh',
								label: 'DVH',
								default: 0,
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
								default: '',
								format: 'text',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'dvh',
				label: 'DVH',
				default: 0,
				format: 'number',
			});
		});

		test('value is empty but there is a unit with value of empty!', () => {
			expect(getUnitByValue('', getCSSUnits('z-index'))).toStrictEqual({
				value: '',
				label: '-',
				default: '',
				format: 'number',
			});
		});
	});

	describe('extractNumberAndUnit', () => {
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
			});
		});

		test('object value', () => {
			expect(
				extractNumberAndUnit({ value: '12', unit: 'px' })
			).toStrictEqual({
				value: '12',
				unit: 'px',
			});

			expect(extractNumberAndUnit({ noValue: '' })).toStrictEqual({
				value: '',
				unit: '',
			});

			expect(extractNumberAndUnit({ value: '12' })).toStrictEqual({
				value: '12',
				unit: '',
			});

			expect(extractNumberAndUnit({ unit: 'px' })).toStrictEqual({
				value: '',
				unit: 'px',
			});
		});

		test('special value', () => {
			expect(extractNumberAndUnit('auto')).toStrictEqual({
				value: 0,
				unit: 'auto',
			});

			expect(extractNumberAndUnit('inherit')).toStrictEqual({
				value: 0,
				unit: 'inherit',
			});
		});

		test('css unit values', () => {
			expect(extractNumberAndUnit('12px')).toStrictEqual({
				value: 12,
				unit: 'px',
			});

			expect(extractNumberAndUnit('1.2px')).toStrictEqual({
				value: 1.2,
				unit: 'px',
			});

			expect(extractNumberAndUnit('-1.2px')).toStrictEqual({
				value: -1.2,
				unit: 'px',
			});

			expect(extractNumberAndUnit('-1.2%')).toStrictEqual({
				value: -1.2,
				unit: '%',
			});
		});

		test('func value', () => {
			expect(extractNumberAndUnit('12pxfunc')).toStrictEqual({
				value: '12px',
				unit: 'func',
			});

			expect(extractNumberAndUnit('12%func')).toStrictEqual({
				value: '12%',
				unit: 'func',
			});

			expect(extractNumberAndUnit('12.2%func')).toStrictEqual({
				value: '12.2%',
				unit: 'func',
			});

			expect(extractNumberAndUnit('-12.2%func')).toStrictEqual({
				value: '-12.2%',
				unit: 'func',
			});

			expect(extractNumberAndUnit('calc(12px + 12px)func')).toStrictEqual(
				{
					value: 'calc(12px + 12px)',
					unit: 'func',
				}
			);

			expect(extractNumberAndUnit('inheritfunc')).toStrictEqual({
				value: 'inherit',
				unit: 'func',
			});

			expect(extractNumberAndUnit('initialfunc')).toStrictEqual({
				value: 'initial',
				unit: 'func',
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
						value: 'rem',
						label: 'REM',
						default: 0,
						format: 'number',
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				default: 0,
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
								value: 'rem',
								label: 'REM',
								default: 0,
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
								default: 0,
								format: 'number',
							},
							{
								value: 'vw',
								label: 'VW',
								default: 0,
								format: 'number',
							},
							{
								value: 'vh',
								label: 'VH',
								default: 0,
								format: 'number',
							},
							{
								value: 'dvw',
								label: 'DVW',
								default: 0,
								format: 'number',
							},
							{
								value: 'dvh',
								label: 'DVH',
								default: 0,
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
								default: '',
								format: 'text',
							},
						],
					},
				])
			).toStrictEqual({
				value: 'px',
				label: 'PX',
				default: 0,
				format: 'number',
			});
		});
	});
});
