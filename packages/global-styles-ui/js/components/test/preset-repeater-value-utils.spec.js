import {
	isPresetRepeaterObjectValue,
	variablesToPresetRepeaterValue,
} from '../preset-repeater-value-utils';

describe('isPresetRepeaterObjectValue', () => {
	it('returns true for plain object maps', () => {
		expect(
			isPresetRepeaterObjectValue({ 'spacing-1': { slug: 'spacing-1' } })
		).toBe(true);
	});

	it('returns false for arrays and nullish values', () => {
		expect(isPresetRepeaterObjectValue([])).toBe(false);
		expect(isPresetRepeaterObjectValue(null)).toBe(false);
		expect(isPresetRepeaterObjectValue(undefined)).toBe(false);
	});
});

describe('variablesToPresetRepeaterValue', () => {
	it('returns empty object for nullish values', () => {
		expect(variablesToPresetRepeaterValue(null)).toEqual({});
		expect(variablesToPresetRepeaterValue(undefined)).toEqual({});
	});

	it('passes through existing repeater object maps unchanged', () => {
		const input = {
			'font-size-fallback-my-size': {
				slug: 'my-size',
				name: 'My Size',
				order: 2,
			},
		};

		expect(variablesToPresetRepeaterValue(input)).toBe(input);
	});

	it('converts preset arrays to slug-keyed repeater maps with order', () => {
		expect(
			variablesToPresetRepeaterValue([
				{ slug: 'spacing-20', name: 'Spacing 20', size: '20px' },
				{ slug: 'spacing-40', name: 'Spacing 40', size: '40px' },
			])
		).toEqual({
			'spacing-20': {
				slug: 'spacing-20',
				name: 'Spacing 20',
				size: '20px',
				order: 1,
			},
			'spacing-40': {
				slug: 'spacing-40',
				name: 'Spacing 40',
				size: '40px',
				order: 2,
			},
		});
	});

	it('falls back to index keys when slug and id are missing', () => {
		expect(
			variablesToPresetRepeaterValue([
				{ name: 'Draft 1' },
				{ name: 'Draft 2' },
			])
		).toEqual({
			0: { name: 'Draft 1', order: 1 },
			1: { name: 'Draft 2', order: 2 },
		});
	});
});
