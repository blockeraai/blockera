/**
 * Internal dependencies
 */
import {
	isValidPx,
	parsePx,
	toPx,
	resolveMediaSettings,
} from '../../../packages/global-packages/packages/editor/js/style-engine/resolve-media-settings';

const breakpoint = (
	type,
	{ min = '', max = '', base = false, status = true } = {}
) => ({
	type,
	base,
	status,
	settings: { min, max },
	attributes: {},
});

describe('isValidPx', () => {
	it('accepts numeric pixel strings', () => {
		expect(isValidPx('991px')).toBe(true);
		expect(isValidPx('0px')).toBe(true);
	});

	it('rejects empty, NaN, and CSS-func values', () => {
		expect(isValidPx('')).toBe(false);
		expect(isValidPx('func')).toBe(false);
		expect(isValidPx('12pxfunc')).toBe(false);
		expect(isValidPx('auto')).toBe(false);
	});
});

describe('parsePx / toPx', () => {
	it('parses leading integers and falls back to 0', () => {
		expect(parsePx('1280px')).toBe(1280);
		expect(parsePx('')).toBe(0);
		expect(parsePx('func')).toBe(0);
	});

	it('formats numbers as px strings', () => {
		expect(toPx(0)).toBe('0px');
		expect(toPx(479)).toBe('479px');
	});
});

describe('resolveMediaSettings', () => {
	it('skips the base breakpoint and items without a type', () => {
		expect(
			resolveMediaSettings({
				desktop: breakpoint('desktop', { base: true }),
				orphan: {
					type: '',
					base: false,
					settings: { min: '', max: '500px' },
					attributes: {},
				},
			})
		).toEqual({});
	});

	it('keeps explicit min/max pairs unchanged', () => {
		const resolved = resolveMediaSettings({
			custom: breakpoint('custom', { min: '600px', max: '900px' }),
		});

		expect(resolved.custom).toEqual({ min: '600px', max: '900px' });
	});

	it('infers min bounds for stacked max-only breakpoints', () => {
		const resolved = resolveMediaSettings({
			desktop: breakpoint('desktop', { base: true }),
			tablet: breakpoint('tablet', { max: '991px' }),
			'mobile-landscape': breakpoint('mobile-landscape', {
				max: '767px',
			}),
			mobile: breakpoint('mobile', { max: '478px' }),
		});

		expect(resolved.tablet).toEqual({ min: '768px', max: '991px' });
		expect(resolved['mobile-landscape']).toEqual({
			min: '479px',
			max: '767px',
		});
		expect(resolved.mobile).toEqual({ min: '0px', max: '478px' });
	});

	it('infers max bounds for stacked min-only breakpoints', () => {
		const resolved = resolveMediaSettings({
			desktop: breakpoint('desktop', { base: true }),
			'l-desktop': breakpoint('l-desktop', { min: '1280px' }),
			'xl-desktop': breakpoint('xl-desktop', { min: '1440px' }),
			'2xl-desktop': breakpoint('2xl-desktop', { min: '1920px' }),
		});

		expect(resolved['l-desktop']).toEqual({
			min: '1280px',
			max: '1439px',
		});
		expect(resolved['xl-desktop']).toEqual({
			min: '1440px',
			max: '1919px',
		});
		expect(resolved['2xl-desktop']).toEqual({
			min: '1920px',
			max: '',
		});
	});

	it('does not infer neighbors from CSS-func bounds', () => {
		const resolved = resolveMediaSettings({
			tablet: breakpoint('tablet', { max: '991px' }),
			custom: breakpoint('custom', { max: '800pxfunc' }),
		});

		expect(resolved.tablet).toEqual({ min: '0px', max: '991px' });
		expect(resolved.custom).toEqual({ min: '', max: '800pxfunc' });
	});

	it('returns an empty object for empty input', () => {
		expect(resolveMediaSettings({})).toEqual({});
	});
});
