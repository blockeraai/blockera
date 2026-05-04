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
 */
export function colorPaletteRowFromRepeaterFields(v: {
	slug: string;
	name: string;
	color?: string;
	isVisible?: boolean;
}): Color {
	return {
		slug: v.slug,
		name: v.name,
		color: v.color || '',
		isVisible: v.isVisible,
	} as Color;
}

export function convertRepeaterValueToColors(newValue: object): Color[] {
	return Object.values(
		newValue as Record<string, Color & Record<string, unknown>>
	).map((v) =>
		colorPaletteRowFromRepeaterFields({
			slug: v.slug,
			name: v.name,
			color: v.color,
			isVisible: v.isVisible as boolean | undefined,
		})
	);
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
