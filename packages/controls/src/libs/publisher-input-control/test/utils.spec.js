/**
 * Internal dependencies
 */
import { isSpecialUnit, getCSSUnits } from '../utils';

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

		test('false', () => {
			expect(isSpecialUnit('false')).toBe(false);
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
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
				{ value: 'auto', label: 'Auto', default: 0 },
				{ value: 'inherit', label: 'Inherit', default: 0 },
				{ value: 'initial', label: 'Initial', default: 0 },
			]);
		});

		test('essential', () => {
			expect(getCSSUnits('essential')).toStrictEqual([
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			]);
		});

		test('margin', () => {
			expect(getCSSUnits('margin')).toStrictEqual([
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
				{ value: 'auto', label: 'Auto', default: 0 },
			]);
		});

		test('padding', () => {
			expect(getCSSUnits('padding')).toStrictEqual([
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			]);
		});

		test('width', () => {
			expect(getCSSUnits('width')).toStrictEqual([
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
				//
				{
					value: 'fit-content',
					label: 'Fit Content',
					default: 0,
				},
				{
					value: 'max-content',
					label: 'Max Content',
					default: 0,
				},
				{
					value: 'min-content',
					label: 'Min Content',
					default: 0,
				},
			]);
		});

		test('percent', () => {
			expect(getCSSUnits('percent')).toStrictEqual([
				{ value: '%', label: '%', default: 0 },
			]);
		});

		test('angle', () => {
			expect(getCSSUnits('angle')).toStrictEqual([
				{ value: 'deg', label: 'DEG', default: 0 },
				{ value: 'rad', label: 'RAD', default: 0 },
				{ value: 'grad', label: 'GRAD', default: 0 },
			]);
		});

		test('duration', () => {
			expect(getCSSUnits('duration')).toStrictEqual([
				{ value: 'ms', label: 'MS', default: 0 },
				{ value: 's', label: 'S', default: 1 },
			]);
		});

		test('background-position', () => {
			expect(getCSSUnits('background-position')).toStrictEqual([
				{ value: '%', label: '%', default: 0 },
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			]);
		});

		test('text-indent', () => {
			expect(getCSSUnits('text-indent')).toStrictEqual([
				{ value: 'px', label: 'PX', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
				{ value: 'initial', label: 'Initial', default: 0 },
				{ value: 'inherit', label: 'Inherit', default: 0 },
			]);
		});

		test('letter-spacing', () => {
			expect(getCSSUnits('letter-spacing')).toStrictEqual([
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
				{ value: 'initial', label: 'Initial', default: 0 },
				{ value: 'inherit', label: 'Inherit', default: 0 },
			]);
		});

		test('background-size', () => {
			expect(getCSSUnits('background-size')).toStrictEqual([
				{ value: 'auto', label: 'Auto', default: 0 },
				{ value: '%', label: '%', default: 0 },
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			]);
		});

		test('box-shadow', () => {
			expect(getCSSUnits('box-shadow')).toStrictEqual([
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			]);
		});

		test('text-shadow', () => {
			expect(getCSSUnits('text-shadow')).toStrictEqual([
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			]);
		});

		test('outline', () => {
			expect(getCSSUnits('outline')).toStrictEqual([
				{ value: 'px', label: 'PX', default: 0 },
				{ value: 'em', label: 'EM', default: 0 },
				{ value: 'rem', label: 'REM', default: 0 },
				{ value: 'ch', label: 'CH', default: 0 },
				{ value: 'vw', label: 'VW', default: 0 },
				{ value: 'vh', label: 'VH', default: 0 },
				{ value: 'dvw', label: 'DVW', default: 0 },
				{ value: 'dvh', label: 'DVH', default: 0 },
			]);
		});
	});
});
