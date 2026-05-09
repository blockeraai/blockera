/**
 * External dependencies
 */
import type { Color, Gradient } from '@wordpress/global-styles-engine';

/**
 * Internal dependencies
 */
import {
	COLOR_SHADE_ANCHOR_STEP,
	COLOR_SHADE_STEPS,
} from './color-shades-generator';

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

/** Drops legacy `*-shade-500` rows; anchor color lives on the main preset only. */
export function stripRedundantPaletteShadeBase<C extends Color>(
	colors: C[]
): C[] {
	return colors.filter((row) => {
		if (!isShadePaletteColor(row as Color & Record<string, unknown>)) {
			return true;
		}
		const p = parsePaletteShadeSlug(String((row as Color).slug ?? ''));
		return (
			p === null ||
			String(p.shadeStep) !== String(COLOR_SHADE_ANCHOR_STEP)
		);
	}) as C[];
}

export function filterMainPaletteColors<C extends Color>(colors: C[]): C[] {
	return colors.filter(
		(row) => !isShadePaletteColor(row as Color & Record<string, unknown>)
	);
}

/**
 * Repeater object keys often do not match palette slugs; resolve the real item id for updates.
 */
export function findRepeaterItemIdBySlug(
	repeaterItems: Record<string, { slug?: string }> | undefined,
	targetSlug: string
): string | number | null {
	if (!repeaterItems) {
		return null;
	}
	for (const [id, row] of Object.entries(repeaterItems)) {
		if (String(row?.slug ?? '') === targetSlug) {
			return id;
		}
	}
	return null;
}

export function convertRepeaterValueToGradients(newValue: object): Gradient[] {
	return Object.values(
		newValue as Record<string, Gradient & Record<string, unknown>>
	).map((v) => ({
		slug: v.slug,
		name: v.name,
		isVisible: v.isVisible,
		gradient: v.gradient || '',
	}));
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
	let colorValue = '';
	if (typeof v.color === 'string') {
		colorValue = v.color;
	} else if (v.color !== undefined && v.color !== null && v.color !== '') {
		colorValue = String(v.color);
	}
	const row: Color & Record<string, unknown> = {
		slug,
		name,
		color: colorValue,
	};
	if (typeof v.isVisible === 'boolean') {
		row.isVisible = v.isVisible;
	}
	if (
		'meta' in v &&
		v.meta !== null &&
		v.meta !== undefined &&
		typeof v.meta === 'object' &&
		!Array.isArray(v.meta)
	) {
		row.meta = { ...(v.meta as Record<string, unknown>) };
	}
	return row as Color;
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
