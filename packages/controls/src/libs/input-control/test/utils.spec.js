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
							label: '-',
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
							label: '-',
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
							label: '-',
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
							label: '-',
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

		test('line-height', () => {
			expect(getCSSUnits('line-height')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: '',
							label: '-',
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

		test('grid-size', () => {
			expect(getCSSUnits('grid-size')).toStrictEqual([
				{
					label: 'Common Values',
					options: [
						{
							value: 'fr',
							label: 'FR',
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
					label: 'Special Values',
					options: [
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

		test('grid-min-size', () => {
			expect(getCSSUnits('grid-min-size')).toStrictEqual([
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
				label: '-',
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
	});
});
