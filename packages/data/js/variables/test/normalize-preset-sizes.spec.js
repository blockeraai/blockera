import {
	normalizeFontSizeFluid,
	normalizeFontSizeThemeJsonPreset,
	normalizePresetSize,
	normalizeSizeThemeJsonPreset,
} from '../normalize-preset-sizes';

describe('normalize-preset-sizes', () => {
	describe('normalizePresetSize', () => {
		test('shorthand rem → explicit leading zero', () => {
			expect(normalizePresetSize('.9rem')).toBe('0.9rem');
		});

		test('canonical values unchanged', () => {
			expect(normalizePresetSize('1.05rem')).toBe('1.05rem');
		});
	});

	describe('normalizeFontSizeFluid', () => {
		test('normalizes min and max', () => {
			expect(
				normalizeFontSizeFluid({
					min: '.9rem',
					max: '1.05rem',
				})
			).toEqual({
				min: '0.9rem',
				max: '1.05rem',
			});
		});

		test('passes through boolean fluid flag', () => {
			expect(normalizeFontSizeFluid(true)).toBe(true);
		});
	});

	describe('normalizeFontSizeThemeJsonPreset', () => {
		test('normalizes size and fluid on preset row', () => {
			expect(
				normalizeFontSizeThemeJsonPreset({
					slug: 'small',
					size: '1.05rem',
					fluid: { min: '.9rem', max: '1.05rem' },
				})
			).toEqual({
				slug: 'small',
				size: '1.05rem',
				fluid: { min: '0.9rem', max: '1.05rem' },
			});
		});
	});

	describe('normalizeSizeThemeJsonPreset', () => {
		test('normalizes spacing preset size', () => {
			expect(
				normalizeSizeThemeJsonPreset({
					slug: '30',
					size: '.75rem',
				})
			).toEqual({
				slug: '30',
				size: '0.75rem',
			});
		});
	});
});
