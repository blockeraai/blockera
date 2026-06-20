/**
 * Internal dependencies
 */
import { finalizeColorString, valueCleanupColorString } from '../css-color';

describe('valueCleanupColorString', () => {
	it('defers 3-digit hex shorthand until finalize', () => {
		expect(valueCleanupColorString('ccc')).toBe('ccc');
		expect(valueCleanupColorString('#ccc')).toBe('#ccc');
		expect(finalizeColorString('ccc')).toBe('#cccccc');
		expect(finalizeColorString('#ccc')).toBe('#cccccc');
		expect(finalizeColorString('fff')).toBe('#ffffff');
	});

	it('waits for complete hex while typing longer values', () => {
		expect(valueCleanupColorString('c4c')).toBe('c4c');
		expect(valueCleanupColorString('c4c4')).toBe('c4c4');
		expect(valueCleanupColorString('c4c4c4')).toBe('#c4c4c4');
		expect(valueCleanupColorString('70c')).toBe('70c');
		expect(valueCleanupColorString('70ca9e')).toBe('#70ca9e');
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
});
