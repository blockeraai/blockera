import { getValueAddonRealValue } from '../helpers';

describe('Helper Functions', () => {
	describe('getValueAddonRealValue', () => {
		test('undefined', () => {
			expect(getValueAddonRealValue()).toBe(undefined);
		});

		test('empty', () => {
			expect(getValueAddonRealValue('')).toBe('');
		});

		test('number', () => {
			expect(getValueAddonRealValue(10)).toBe(10);
		});

		test('number as text', () => {
			expect(getValueAddonRealValue('10')).toBe('10');
		});

		test('css unit values', () => {
			expect(getValueAddonRealValue('10px')).toBe('10px');
			expect(getValueAddonRealValue('10em')).toBe('10em');
			expect(getValueAddonRealValue('10rem')).toBe('10rem');
			expect(getValueAddonRealValue('10%')).toBe('10%');
		});

		test('css func unit values', () => {
			expect(getValueAddonRealValue('calc(12px)func')).toBe('calc(12px)');
			expect(getValueAddonRealValue('var(--is-publisher)func')).toBe(
				'var(--is-publisher)'
			);
			expect(getValueAddonRealValue('func')).toBe('');
		});
	});
});
