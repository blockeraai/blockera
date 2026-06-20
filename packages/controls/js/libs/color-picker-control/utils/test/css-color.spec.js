/**
 * Internal dependencies
 */
import { finalizeColorString, valueCleanupColorString } from '../css-color';

describe('valueCleanupColorString', () => {
	it('normalizes 3-digit hex shorthand without hash', () => {
		expect(valueCleanupColorString('ccc')).toBe('#cccccc');
		expect(valueCleanupColorString('fff')).toBe('#ffffff');
		expect(valueCleanupColorString('f00')).toBe('#ff0000');
	});

	it('keeps partial hex and keyword typing intact', () => {
		expect(valueCleanupColorString('c')).toBe('c');
		expect(valueCleanupColorString('cc')).toBe('cc');
		expect(valueCleanupColorString('cur')).toBe('cur');
		expect(valueCleanupColorString('currentColor')).toBe('currentColor');
	});

	it('keeps placeholder-compatible CSS values intact', () => {
		expect(valueCleanupColorString('currentColor')).toBe('currentColor');
		expect(valueCleanupColorString('var(--token)')).toBe('var(--token)');
		expect(valueCleanupColorString('rgb(255, 0, 0)')).toBe(
			'rgb(255, 0, 0)'
		);
	});

	it('normalizes complete hex values', () => {
		expect(valueCleanupColorString('dddddd')).toBe('#dddddd');
		expect(valueCleanupColorString('#283f8a')).toBe('#283f8a');
	});

	it('defers hash-prefixed 3-digit shorthand until finalize', () => {
		expect(valueCleanupColorString('#ccc')).toBe('#ccc');
		expect(finalizeColorString('#ccc')).toBe('#cccccc');
	});
});
