/**
 * External dependencies
 */
import type { Color, Gradient } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { getValueAddonRealValue, isValid } from '@blockera/controls';
import { parseVarString } from '@blockera/data';

/**
 * Internal dependencies
 */
import {
	compositeResolvedValueFromStoredPlainPresetInput,
	normalizeCompositePlainPresetPaintPart,
	splitStoredCompositePlainPresetValue,
} from '../theme-json-plain-preset';
import { COLOR_SHADE_STEPS } from './color-shades-generator';
import { withPresetMetaFromRepeaterRow } from '../components/preset-meta-utils';

const PALETTE_SHADE_SLUG_MARKER = '-shade-';

/**
 * Parses `{parentSlug}-shade-{step}` (step is a known shade index, e.g. 500).
 */
export function parsePaletteShadeSlug(
	slug: string
): { baseSlug: string; shadeStep: string } | null {
	const i = slug.lastIndexOf(PALETTE_SHADE_SLUG_MARKER);
	if (i <= 0) {
		return null;
	}
	const baseSlug = slug.slice(0, i);
	const shadeStep = slug.slice(i + PALETTE_SHADE_SLUG_MARKER.length);
	const stepNum = Number(shadeStep);
	if (
		!baseSlug ||
		!/^\d+$/.test(shadeStep) ||
		!COLOR_SHADE_STEPS.some((step) => step === stepNum)
	) {
		return null;
	}
	return { baseSlug, shadeStep };
}

export function isShadePaletteColor(
	c: Color & Record<string, unknown>
): boolean {
	return parsePaletteShadeSlug(String((c as Color).slug ?? '')) !== null;
}

/**
 * Palette merge helper hook — anchor `*-shade-500` rows are persisted like other steps,
 * so nothing is stripped here (API retained for callers).
 */
export function stripRedundantPaletteShadeBase<C extends Color>(
	colors: C[]
): C[] {
	return colors;
}

export function filterMainPaletteColors<C extends Color>(colors: C[]): C[] {
	return colors.filter(
		(row) => !isShadePaletteColor(row as Color & Record<string, unknown>)
	);
}

export { findRepeaterItemIdBySlug } from '../components/preset-taxonomy-ui/preset-taxonomy-utils';

function palettePickerTypeFromRepeaterRow(v: Record<string, unknown>): string {
	if (typeof v.type === 'string' && v.type !== '') {
		return v.type;
	}
	return inferPalettePickerTypeFromColorRaw(v.color);
}

function inferPalettePickerTypeFromColorRaw(raw: unknown): string {
	if (
		raw !== null &&
		typeof raw === 'object' &&
		'settings' in raw &&
		raw.settings !== null &&
		typeof raw.settings === 'object' &&
		'type' in (raw.settings as Record<string, unknown>)
	) {
		const st = String((raw.settings as { type?: string }).type ?? '');
		if (
			st === 'linear-gradient' ||
			st === 'radial-gradient' ||
			st === 'color'
		) {
			return st;
		}
	}
	if (typeof raw === 'string') {
		const s = raw;
		if (
			s.includes('|gradient|') ||
			s.startsWith('var(--wp--preset--gradient--')
		) {
			return 'linear-gradient';
		}
	}
	return 'color';
}

function parseVarStringCategoryForPalette(pickerType: string): string {
	if (pickerType === 'linear-gradient' || pickerType === 'radial-gradient') {
		return 'gradient';
	}
	return pickerType;
}

/**
 * When `color` is a Block Editor variable reference (`var:` / `var(--wp--preset--…)`),
 * returns the preset id slug only (no wrappers). Otherwise returns null.
 */
function presetSlugFromVariableLikeColorString(
	value: string,
	pickerType: string
): string | null {
	const trimmed = value.trim();
	if (trimmed === '') {
		return null;
	}
	const category = parseVarStringCategoryForPalette(pickerType);
	const parsed = parseVarString(trimmed, category);
	return parsed.id && parsed.id !== '' ? parsed.id : null;
}

/**
 * Normalizes repeater `color` for palette persistence. Value-addon objects become
 * `resolvedCss,presetSlug` when both resolve; strings matching variable wrappers collapse to slug-only;
 * already composite strings round-trip unchanged.
 */
export function normalizeRepeaterPaletteColorValue(
	raw: unknown,
	pickerType: string
): string {
	if (raw === undefined || raw === null || raw === '') {
		return '';
	}

	if (typeof raw === 'string') {
		const trimmed = raw.trim();
		if (trimmed === '') {
			return '';
		}
		if (splitStoredCompositePlainPresetValue(trimmed)) {
			return trimmed;
		}
		return (
			presetSlugFromVariableLikeColorString(trimmed, pickerType) ??
			trimmed
		);
	}

	if (typeof raw === 'object' && raw !== null && isValid(raw)) {
		const addon = raw as {
			settings?: { id?: string };
		};

		const resolved = getValueAddonRealValue(raw);
		const resolvedStr = typeof resolved === 'string' ? resolved.trim() : '';

		const slugFromResolved =
			resolvedStr !== ''
				? presetSlugFromVariableLikeColorString(resolvedStr, pickerType)
				: null;

		const idFromSettings =
			typeof addon.settings?.id === 'string' && addon.settings.id !== ''
				? addon.settings.id
				: '';

		const slug = slugFromResolved ?? idFromSettings;

		if (resolvedStr !== '' && slug !== '') {
			return `${resolvedStr},${slug}`;
		}

		return slug || resolvedStr;
	}

	if (typeof raw === 'object' && raw !== null) {
		return '';
	}

	return String(raw);
}

/**
 * Resolved paint string for shade stacks / indicators from persisted palette `color`.
 * Uses the same composite split + var fallback rules as storage normalization
 * ({@link normalizeRepeaterPaletteColorValue}), without re-encoding to composite.
 */
export function paintPartFromStoredPaletteColorString(
	stored: string | undefined
): string {
	if (!stored || typeof stored !== 'string') {
		return '';
	}
	const trimmed = stored.trim();
	if (trimmed === '') {
		return '';
	}
	const fromComposite =
		compositeResolvedValueFromStoredPlainPresetInput(trimmed);
	if (fromComposite !== '') {
		return fromComposite;
	}
	return normalizeCompositePlainPresetPaintPart(trimmed);
}

export function convertRepeaterValueToGradients(newValue: object): Gradient[] {
	return Object.values(
		newValue as Record<string, Gradient & Record<string, unknown>>
	).map((v) =>
		withPresetMetaFromRepeaterRow(v as Record<string, unknown>, {
			slug: v.slug,
			name: v.name,
			isVisible: v.isVisible,
			gradient: v.gradient || '',
		})
	);
}

/**
 * One palette row as persisted from the repeater (see convertRepeaterValueToColors).
 * Preserves `theme.json` **meta** (taxonomy, descriptions, etc.) so repeater round-trips do not drop it.
 */
export function colorPaletteRowFromRepeaterFields(
	v: Record<string, unknown>
): Color & Record<string, unknown> {
	const slug = String(v.slug ?? '');
	const name = String(v.name ?? '');
	const pickerType = palettePickerTypeFromRepeaterRow(v);
	const colorValue =
		v.color === undefined || v.color === null || v.color === ''
			? ''
			: normalizeRepeaterPaletteColorValue(v.color, pickerType);

	const row: Color & Record<string, unknown> = {
		slug,
		name,
		color: colorValue,
	};
	if (typeof v.type === 'string' && v.type !== '') {
		row.type = v.type;
	}
	if (typeof v.isVisible === 'boolean') {
		row.isVisible = v.isVisible;
	}
	return withPresetMetaFromRepeaterRow(v, row) as Color &
		Record<string, unknown>;
}

/**
 * When the controls repeater omits or clears `meta`, keep the previous palette row's meta for that slug.
 */
export function inheritPaletteMetaFromPrevious<C extends Color>(
	previousRow: C | undefined,
	incomingRow: C
): C {
	if (!previousRow) {
		return incomingRow;
	}
	const prev = previousRow as Record<string, unknown>;
	const next = incomingRow as Record<string, unknown>;
	const nextMeta = next.meta;
	const nextHasMetaObject =
		nextMeta !== null &&
		nextMeta !== undefined &&
		typeof nextMeta === 'object' &&
		!Array.isArray(nextMeta);
	if (nextHasMetaObject) {
		return incomingRow;
	}
	const prevMeta = prev.meta;
	if (
		prevMeta !== null &&
		prevMeta !== undefined &&
		typeof prevMeta === 'object' &&
		!Array.isArray(prevMeta)
	) {
		return { ...incomingRow, meta: prevMeta } as C;
	}
	return incomingRow;
}

/** Carries over shade rows when the repeater omits them but the parent base still exists. */
export function mergeColorPaletteWithKeptShades<C extends Color>(
	previousPalette: C[],
	nextMain: C[]
): C[] {
	const slugSet = new Set(nextMain.map((c) => String(c.slug ?? '')));
	const keptShades = previousPalette.filter((c) => {
		if (!isShadePaletteColor(c as Color & Record<string, unknown>)) {
			return false;
		}
		const p = parsePaletteShadeSlug(String(c.slug ?? ''));
		if (p === null || !slugSet.has(p.baseSlug)) {
			return false;
		}
		return !slugSet.has(String(c.slug ?? ''));
	});
	return stripRedundantPaletteShadeBase([...nextMain, ...keptShades]);
}

export function convertRepeaterValueToColors(
	newValue: object,
	previousPalette?: Color[]
): Color[] {
	const prevBySlug = previousPalette?.length
		? new Map(
				previousPalette.map((c) => [String((c as Color).slug ?? ''), c])
			)
		: undefined;

	return Object.values(
		newValue as Record<string, Color & Record<string, unknown>>
	).map((v) => {
		const row = colorPaletteRowFromRepeaterFields(
			v as Record<string, unknown>
		) as Color;
		if (!prevBySlug) {
			return row;
		}
		return inheritPaletteMetaFromPrevious(
			prevBySlug.get(String(row.slug ?? '')),
			row
		);
	});
}

export function filterLinearGradients(
	gradients: Gradient[] | undefined
): Gradient[] {
	if (!gradients || !Array.isArray(gradients)) {
		return [];
	}
	return gradients.filter((g) =>
		(g?.gradient || '').startsWith('linear-gradient')
	);
}

export function filterRadialGradients(
	gradients: Gradient[] | undefined
): Gradient[] {
	if (!gradients || !Array.isArray(gradients)) {
		return [];
	}
	return gradients.filter((g) =>
		(g?.gradient || '').startsWith('radial-gradient')
	);
}

/** Normalize hex strings for ramp vs baseline comparisons. */
export function normalizeHexForCompare(value: string | undefined): string {
	if (!value || typeof value !== 'string') {
		return '';
	}
	let hex = value.replace(/\s/g, '').replace(/^#/, '');
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map((char) => char + char)
			.join('');
	}
	if (hex.length === 6) {
		return hex.toUpperCase();
	}
	return value.trim().replace(/^#/, '').toUpperCase();
}

export function shadeHexDiffersFromBaseline(
	current: string,
	expected: string | undefined
): boolean {
	if (!expected) {
		return false;
	}
	const a = normalizeHexForCompare(current);
	const b = normalizeHexForCompare(expected);
	return Boolean(a && b && a !== b);
}

/**
 * Theme palette rows from global-styles `settings.color`: prefers `palette.theme`,
 * falls back to a flat `palette` array (raw theme.json).
 */
export function resolveColorPaletteThemeRows(colorSettings: unknown): Color[] {
	if (!colorSettings || typeof colorSettings !== 'object') {
		return [];
	}
	const palette = (colorSettings as { palette?: unknown }).palette;
	if (Array.isArray(palette)) {
		return palette as Color[];
	}
	if (palette && typeof palette === 'object') {
		const theme = (palette as { theme?: unknown }).theme;
		if (Array.isArray(theme)) {
			return theme as Color[];
		}
	}
	return [];
}
