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
});
