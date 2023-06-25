/**
 * Internal dependencies
 */
import { isSpecialUnit } from '../utils';

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
});
