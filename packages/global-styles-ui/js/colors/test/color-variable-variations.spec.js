/**
 * Standalone unit tests for color preset variable variations (shade ramps, slug encoding,
 * display ramp synthesis, and palette merge helpers). No theme.json fixtures — exercises
 * internal modules only (`color-shades-generator`, `color-palette-variations-utils`, `utils`).
 */
jest.mock('@blockera/controls', () => ({
	getValueAddonRealValue: (v) => v,
	isValid: () => true,
	splitStoredCompositePlainColorValue: () => null,
	normalizeCompositePlainPresetPaintPart: (s) =>
		typeof s === 'string' ? s.trim() : '',
	plainPresetSlugFromStoredPlainPresetInput: (s) =>
		typeof s === 'string' ? s.trim() : '',
	compositePlainColorPaintFromStoredPlainPresetInput: () => '',
	unlinkPlainThemeJsonPresetCompositeToScalar: (x) => x,
	isLikelyThemeJsonPlainPresetSlugString: () => false,
}));

import {
	COLOR_SHADE_ANCHOR_STEP,
	COLOR_SHADE_STEPS,
	generateColorShades,
} from '../color-shades-generator';
import {
	buildVariationPresetsForBase,
	filterVariationsByBase,
	formatShadePresetName,
	getDisplayShadeRamp,
	getDisplayShadeRampWithStackMap,
	rebuildVariationsFromMainColor,
	shadeVariationSlug,
	stackValueFromShades,
	variationsToStackMap,
} from '../color-palette-variations-utils';
import {
	filterMainPaletteColors,
	isShadePaletteColor,
	mergeColorPaletteWithKeptShades,
	normalizeHexForCompare,
	parsePaletteShadeSlug,
	shadeHexDiffersFromBaseline,
} from '../utils';

const base = { slug: 'brand', name: 'Brand', color: '#627398' };

function shadeRow(step, hex = '#111111') {
	return {
		slug: shadeVariationSlug('brand', step),
		name: `Brand ${step}`,
		color: hex,
		isVisible: true,
	};
}

describe('color shade generation (OKLCH ramp)', () => {
	it('exposes the Tailwind-style steps and anchor at 500', () => {
		expect(COLOR_SHADE_STEPS).toContain(500);
		expect(COLOR_SHADE_ANCHOR_STEP).toBe(500);
		expect(COLOR_SHADE_STEPS.length).toBe(11);
	});

	it('pins the input hex to step 500 (case-normalized)', () => {
		const shades = generateColorShades('#aabbcc');
		expect(shades['500']).toBe('#AABBCC');
	});

	it('every step key exists and returns a #RRGGBB string', () => {
		const shades = generateColorShades('#627398');
		for (const step of COLOR_SHADE_STEPS) {
			const key = String(step);
			expect(shades).toHaveProperty(key);
			expect(shades[key]).toMatch(/^#[0-9A-F]{6}$/);
		}
	});

	it('light steps are lighter than base and dark steps are darker (L at 500)', () => {
		const shades = generateColorShades('#627398');
		const parseLuminosity = (hex) => {
			const n = parseInt(hex.replace('#', ''), 16);
			const r = (n >> 16) & 255;
			const g = (n >> 8) & 255;
			const b = n & 255;
			return 0.2126 * r + 0.7152 * g + 0.0722 * b;
		};
		const l500 = parseLuminosity(shades['500']);
		expect(parseLuminosity(shades['50'])).toBeGreaterThan(l500);
		expect(parseLuminosity(shades['950'])).toBeLessThan(l500);
	});
});

describe('palette shade slug parse & classification', () => {
	it('parsePaletteShadeSlug decodes parent slug and numeric step', () => {
		expect(parsePaletteShadeSlug('foo-shade-500')).toEqual({
			baseSlug: 'foo',
			shadeStep: '500',
		});
		expect(parsePaletteShadeSlug('my-base-shade-200')).toEqual({
			baseSlug: 'my-base',
			shadeStep: '200',
		});
	});

	it('rejects invalid markers, steps, or unknown step numbers', () => {
		expect(parsePaletteShadeSlug('noshade')).toBeNull();
		expect(parsePaletteShadeSlug('-shade-500')).toBeNull();
		expect(parsePaletteShadeSlug('x-shade-abc')).toBeNull();
		expect(parsePaletteShadeSlug('x-shade-333')).toBeNull();
	});

	it('isShadePaletteColor is true only for valid *-shade-{step} slugs', () => {
		expect(
			isShadePaletteColor({
				slug: 'brand-shade-600',
				name: '',
				color: '#000',
			})
		).toBe(true);
		expect(
			isShadePaletteColor({ slug: 'brand', name: '', color: '#000' })
		).toBe(false);
	});

	it('filterMainPaletteColors removes encoded shade rows', () => {
		const rows = [
			{ slug: 'brand', name: 'Brand', color: '#000' },
			shadeRow(500),
		];
		const mains = filterMainPaletteColors(rows);
		expect(mains).toHaveLength(1);
		expect(mains[0].slug).toBe('brand');
	});
});

describe('hex compare / “customized shade” detection', () => {
	it('normalizeHexForCompare uppercases and expands 3-digit hex', () => {
		expect(normalizeHexForCompare('#abc')).toBe('AABBCC');
		expect(normalizeHexForCompare('#AaBbCc')).toBe('AABBCC');
	});

	it('shadeHexDiffersFromBaseline is false when missing expected or equal', () => {
		expect(shadeHexDiffersFromBaseline('#ff00ff', undefined)).toBe(false);
		expect(shadeHexDiffersFromBaseline('#FF00FF', '#ff00ff')).toBe(false);
	});

	it('shadeHexDiffersFromBaseline is true when edited away from baseline', () => {
		expect(shadeHexDiffersFromBaseline('#000000', '#FFFFFF')).toBe(true);
	});
});

describe('color-palette-variations-utils', () => {
	it('shadeVariationSlug joins base slug and step', () => {
		expect(shadeVariationSlug('x', 50)).toBe('x-shade-50');
		expect(shadeVariationSlug('x', '950')).toBe('x-shade-950');
	});

	it('formatShadePresetName is full parent name plus step', () => {
		expect(formatShadePresetName('Neutral', 200)).toBe('Neutral 200');
		expect(formatShadePresetName('Accent', '50')).toBe('Accent 50');
		expect(formatShadePresetName('Design System/Neutral', 400)).toBe(
			'Design System/Neutral 400'
		);
		expect(formatShadePresetName('', 500)).toBe('500');
	});

	it('filterVariationsByBase only returns shade rows for that base', () => {
		const all = [
			{ slug: 'brand', name: 'Brand', color: '#000' },
			shadeRow(500, '#111'),
			shadeRow(600, '#222'),
			{
				slug: 'other-shade-500',
				name: 'O',
				color: '#333',
			},
		];
		const forBrand = filterVariationsByBase(all, 'brand');
		expect(forBrand).toHaveLength(2);
		expect(forBrand.map((r) => r.slug).sort()).toEqual([
			'brand-shade-500',
			'brand-shade-600',
		]);
	});

	it('variationsToStackMap prefers full-length ramp order when length matches steps', () => {
		const ramp = COLOR_SHADE_STEPS.map((step) => ({
			slug: shadeVariationSlug('z', step),
			name: String(step),
			color: `#${String(step).padStart(2, '0')}0000`,
		}));
		const map = variationsToStackMap(ramp);
		expect(Object.keys(map).length).toBe(COLOR_SHADE_STEPS.length);
		expect(map['50']).toMatch(/^#/);
	});

	it('stackValueFromShades preserves step order and type tag', () => {
		const stack = stackValueFromShades({
			50: '#111111',
			500: '#627398',
		});
		expect(stack.length).toBe(COLOR_SHADE_STEPS.length);
		expect(stack[0]).toEqual({ value: '#111111', type: 'color' });
		expect(stack.every((x) => x.type === 'color')).toBe(true);
	});

	it('getDisplayShadeRamp synthesizes anchor 500 from main preset when not stored', () => {
		const all = [base, shadeRow(600, '#222222')];
		const ramp = getDisplayShadeRamp(all, 'brand', base);
		const at500 = ramp.find(
			(r) =>
				parsePaletteShadeSlug(String(r.slug ?? ''))?.shadeStep === '500'
		);
		expect(at500).toBeDefined();
		expect(String(at500.color).toUpperCase()).toContain('627398');
	});

	it('getDisplayShadeRampWithStackMap returns aligned ramp and stack map', () => {
		const all = [base, shadeRow(500, '#627398'), shadeRow(200, '#eeeeee')];
		const { ramp, stackMap } = getDisplayShadeRampWithStackMap(
			all,
			'brand',
			base
		);
		expect(ramp.length).toBe(COLOR_SHADE_STEPS.length);
		expect(stackMap['500'].toUpperCase()).toContain('627398');
		expect(stackMap['200'].toUpperCase()).toContain('EEEEEE');
	});

	it('buildVariationPresetsForBase yields one row per step with encoded slugs', () => {
		const shades = generateColorShades('#627398');
		const rows = buildVariationPresetsForBase(
			{ slug: 'brand', name: 'Brand' },
			shades
		);
		expect(rows).toHaveLength(COLOR_SHADE_STEPS.length);
		expect(rows.every((r) => isShadePaletteColor(r))).toBe(true);
		expect(rows.map((r) => r.slug).sort()).toEqual(
			COLOR_SHADE_STEPS.map((s) => shadeVariationSlug('brand', s)).sort()
		);
		expect(rows.map((r) => r.name)).toEqual(
			COLOR_SHADE_STEPS.map((s) => `Brand ${s}`)
		);
	});

	it('rebuildVariationsFromMainColor rebuilds full ramp from plain hex', () => {
		const rows = rebuildVariationsFromMainColor(base, '#aabbcc');
		expect(rows).toHaveLength(COLOR_SHADE_STEPS.length);
		const at500 = rows.find(
			(r) =>
				parsePaletteShadeSlug(String(r.slug ?? ''))?.shadeStep === '500'
		);
		expect(String(at500?.color ?? '').toUpperCase()).toContain('AABBCC');
	});
});

describe('mergeColorPaletteWithKeptShades', () => {
	it('keeps prior shade rows when new main list drops them but base remains', () => {
		const previous = [
			base,
			shadeRow(500, '#627398'),
			shadeRow(600, '#111111'),
		];
		const nextMain = [
			{ slug: 'brand', name: 'Brand Updated', color: '#000000' },
		];
		const merged = mergeColorPaletteWithKeptShades(previous, nextMain);
		const slugs = merged.map((r) => r.slug).sort();
		expect(slugs).toContain('brand-shade-500');
		expect(slugs).toContain('brand-shade-600');
		expect(slugs).toContain('brand');
	});

	it('does not keep shades whose base slug disappeared', () => {
		const previous = [base, shadeRow(500)];
		const merged = mergeColorPaletteWithKeptShades(previous, []);
		expect(merged.some((r) => String(r.slug).includes('-shade-'))).toBe(
			false
		);
	});
});
