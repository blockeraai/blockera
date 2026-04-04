import { normalizeCssLengthValue } from '../index';

describe('normalizeCssLengthValue', () => {
	test('nullish → empty string', () => {
		expect(normalizeCssLengthValue(undefined)).toBe('');
		expect(normalizeCssLengthValue(null)).toBe('');
	});

	test('number 0 → 0px', () => {
		expect(normalizeCssLengthValue(0)).toBe('0px');
	});

	test('non-zero number → string (passthrough)', () => {
		expect(normalizeCssLengthValue(2)).toBe('2');
		expect(normalizeCssLengthValue(-1)).toBe('-1');
	});

	test('string bare zero → 0px', () => {
		expect(normalizeCssLengthValue('0')).toBe('0px');
		expect(normalizeCssLengthValue(' 0 ')).toBe('0px');
		expect(normalizeCssLengthValue('\t0\n')).toBe('0px');
	});

	test('explicit zero lengths unchanged', () => {
		expect(normalizeCssLengthValue('0px')).toBe('0px');
		expect(normalizeCssLengthValue('0em')).toBe('0em');
		expect(normalizeCssLengthValue('0rem')).toBe('0rem');
		expect(normalizeCssLengthValue('0%')).toBe('0%');
	});

	test('other length strings unchanged', () => {
		expect(normalizeCssLengthValue('')).toBe('');
		expect(normalizeCssLengthValue('2px')).toBe('2px');
		expect(normalizeCssLengthValue('thin')).toBe('thin');
		expect(normalizeCssLengthValue('0 0 0 2px')).toBe('0 0 0 2px');
	});

	test('strips trailing !important', () => {
		expect(normalizeCssLengthValue('2px !important')).toBe('2px');
		expect(normalizeCssLengthValue('2px!important')).toBe('2px');
		expect(normalizeCssLengthValue('2px ! important')).toBe('2px');
		expect(normalizeCssLengthValue('0 !IMPORTANT')).toBe('0px');
		expect(normalizeCssLengthValue('  -.5 !important  ')).toBe('-0.5px');
	});

	test('shorthand leading decimal → explicit zero before dot', () => {
		expect(normalizeCssLengthValue('-.5px')).toBe('-0.5px');
		expect(normalizeCssLengthValue('-.5')).toBe('-0.5px');
		expect(normalizeCssLengthValue('.5')).toBe('0.5px');
		expect(normalizeCssLengthValue('.5px')).toBe('0.5px');
		expect(normalizeCssLengthValue('.5rem')).toBe('0.5rem');
		expect(normalizeCssLengthValue('  -.25em  ')).toBe('-0.25em');
		expect(normalizeCssLengthValue('  -.125  ')).toBe('-0.125px');
	});

	test('already canonical decimals unchanged', () => {
		expect(normalizeCssLengthValue('-0.5px')).toBe('-0.5px');
		expect(normalizeCssLengthValue('0.5px')).toBe('0.5px');
		expect(normalizeCssLengthValue('1.5px')).toBe('1.5px');
	});

	describe('defaultUnit', () => {
		test('omitted uses px', () => {
			expect(normalizeCssLengthValue(0)).toBe('0px');
			expect(normalizeCssLengthValue('0')).toBe('0px');
			expect(normalizeCssLengthValue('-.5')).toBe('-0.5px');
		});

		test('empty string: no synthesized suffix', () => {
			expect(normalizeCssLengthValue(0, '')).toBe('0');
			expect(normalizeCssLengthValue('0', '')).toBe('0');
			expect(normalizeCssLengthValue('-.5', '')).toBe('-0.5');
			expect(normalizeCssLengthValue('.5', '')).toBe('0.5');
		});

		test('custom unit', () => {
			expect(normalizeCssLengthValue(0, 'em')).toBe('0em');
			expect(normalizeCssLengthValue('0', 'rem')).toBe('0rem');
			expect(normalizeCssLengthValue('-.5', 'em')).toBe('-0.5em');
			expect(normalizeCssLengthValue('.25', '%')).toBe('0.25%');
		});
	});
});
