/**
 * Internal dependencies
 */
import { getIconKebabId } from '../helpers';

describe('Helpers functions', () => {
	describe('getIconKebabId function', () => {
		it('simple id', () => {
			expect(getIconKebabId('Icon')).toBe('icon');
		});

		it('2 words', () => {
			expect(getIconKebabId('LargeIcon')).toBe('large-icon');
		});

		it('3 words', () => {
			expect(getIconKebabId('ExtraLargeIcon')).toBe('extra-large-icon');
		});

		it('end with one char', () => {
			expect(getIconKebabId('IconX')).toBe('icon-x');
		});

		it('begin with one char', () => {
			expect(getIconKebabId('XIcon')).toBe('x-icon');
		});

		it('begin and end with one char', () => {
			expect(getIconKebabId('XIconX')).toBe('x-icon-x');
		});

		it('id with numbers at the begging', () => {
			expect(getIconKebabId('1Icon')).toBe('1-icon');
		});

		it('id with numbers at the end', () => {
			expect(getIconKebabId('Icon1')).toBe('icon-1');
		});

		it('id with numbers in middle', () => {
			expect(getIconKebabId('Icon1Icon')).toBe('icon-1-icon');
		});

		it('id with 2 uppercase char', () => {
			expect(getIconKebabId('IconXL')).toBe('icon-x-l');
		});

		it('id with 1 uppercase char', () => {
			expect(getIconKebabId('IconXl')).toBe('icon-xl');
		});
	});
});
