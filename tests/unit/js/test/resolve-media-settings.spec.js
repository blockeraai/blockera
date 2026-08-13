/**
 * Internal dependencies
 */
import {
	isValidPx,
	parsePx,
	toPx,
	resolveMediaSettings,
} from '../../../../packages/global-packages/packages/editor/js/style-engine/resolve-media-settings';

const bp = (type, settings, extra = {}) => ({
	type,
	base: false,
	settings,
	...extra,
});

describe('resolveMediaSettings helpers', () => {
	it('rejects empty, NaN, and CSS-func max/min values', () => {
		expect(isValidPx('')).toBe(false);
		expect(isValidPx('func')).toBe(false);
		expect(isValidPx('991pxfunc')).toBe(false);
		expect(isValidPx('not-a-number')).toBe(false);
		expect(isValidPx('991px')).toBe(true);
	});

	it('parses pixel strings and formats them back', () => {
		expect(parsePx('991px')).toBe(991);
		expect(parsePx('')).toBe(0);
		expect(toPx(768)).toBe('768px');
	});
});

describe('resolveMediaSettings', () => {
	it('keeps explicit min/max pairs unchanged', () => {
		expect(
			resolveMediaSettings({
				custom: bp('custom', { min: '600px', max: '900px' }),
			})
		).toEqual({
			custom: { min: '600px', max: '900px' },
		});
	});

	it('skips the base breakpoint and items without a type', () => {
		expect(
			resolveMediaSettings({
				desktop: bp('desktop', { min: '', max: '' }, { base: true }),
				untyped: { type: '', base: false, settings: { max: '500px' } },
			})
		).toEqual({});
	});

	it('infers min bounds for max-only breakpoints from the next smaller max', () => {
		const resolved = resolveMediaSettings({
			desktop: bp('desktop', { min: '', max: '' }, { base: true }),
			tablet: bp('tablet', { min: '', max: '991px' }),
			'mobile-landscape': bp('mobile-landscape', {
				min: '',
				max: '767px',
			}),
			mobile: bp('mobile', { min: '', max: '478px' }),
		});

		expect(resolved.tablet).toEqual({ min: '768px', max: '991px' });
		expect(resolved['mobile-landscape']).toEqual({
			min: '479px',
			max: '767px',
		});
		expect(resolved.mobile).toEqual({ min: '0px', max: '478px' });
	});

	it('infers max bounds for min-only breakpoints from the next larger min', () => {
		const resolved = resolveMediaSettings({
			desktop: bp('desktop', { min: '', max: '' }, { base: true }),
			'l-desktop': bp('l-desktop', { min: '1280px', max: '' }),
			'xl-desktop': bp('xl-desktop', { min: '1440px', max: '' }),
			'2xl-desktop': bp('2xl-desktop', { min: '1920px', max: '' }),
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

	it('falls back to the declared bound when the other side is not a valid px value', () => {
		const resolved = resolveMediaSettings({
			odd: bp('odd', { min: 'clamp(1rem, 2vw, 3rem)', max: '900px' }),
			css: bp('css', { min: '1200px', max: 'func' }),
		});

		expect(resolved.odd).toEqual({
			min: 'clamp(1rem, 2vw, 3rem)',
			max: '900px',
		});
		expect(resolved.css).toEqual({ min: '1200px', max: 'func' });
	});
});
