import { checkVisibleItemLength } from '..';

describe('test checkVisibleItemLength function', () => {
	test('should return 0, when pass empty array', () => {
		expect(checkVisibleItemLength([])).toBe(0);
	});

	test('should return 0, when pass array with invisible item', () => {
		expect(checkVisibleItemLength([{ isVisible: false }])).toBe(0);
	});

	test('should return 1, when pass array with one visible item', () => {
		expect(checkVisibleItemLength([{ isVisible: true }])).toBe(1);
	});

	test('should return 2, when pass array with two visible item', () => {
		expect(
			checkVisibleItemLength([
				{ isVisible: true },
				{ isVisible: true },
				{ isVisible: false },
			])
		).toBe(2);
	});
});
