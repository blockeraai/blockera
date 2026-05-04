/**
 * External dependencies
 */
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Internal dependencies
 */
import {
	COLOR_SHADE_ANCHOR_STEP,
	COLOR_SHADE_STEPS,
	type ColorShadesMap,
	generateColorShades,
} from './color-shades-generator';
import {
	colorPaletteRowFromRepeaterFields,
	isShadePaletteColor,
	parsePaletteShadeSlug,
} from './utils';

export function shadeVariationSlug(
	baseSlug: string,
	step: number | string
): string {
	return `${baseSlug}-shade-${step}`;
}

export function filterVariationsByBase(
	all: Color[],
	baseSlug: string
): Color[] {
	return all.filter((row) => {
		if (!isShadePaletteColor(row as Color & Record<string, unknown>)) {
			return false;
		}
		const p = parsePaletteShadeSlug(String(row.slug ?? ''));
		if (p === null || p.baseSlug !== baseSlug) {
			return false;
		}
		/* Legacy rows; anchor matches main preset and is not persisted anymore. */
		return String(p.shadeStep) !== String(COLOR_SHADE_ANCHOR_STEP);
	});
}

export function variationsToStackMap(rows: Color[]): ColorShadesMap {
	const map: ColorShadesMap = {};
	for (const row of rows) {
		const p = parsePaletteShadeSlug(String(row.slug ?? ''));
		if (p) {
			map[p.shadeStep] = row.color;
		}
	}
	return map;
}

export function stackValueFromShades(
	colorShades: ColorShadesMap | undefined
): Array<{ value: string; type: 'color' }> {
	if (!colorShades) {
		return [];
	}
	return COLOR_SHADE_STEPS.map((step) => ({
		value: colorShades[String(step)] ?? '',
		type: 'color' as const,
	}));
}

/**
 * Full ramp for UI (indicator stack, nested shade rows): persisted shades plus synthetic anchor
 * from the main preset color (not a separate `palette.${origin}` entry).
 */
export function getDisplayShadeRamp(
	all: Color[],
	baseSlug: string,
	mainPreset: { slug: string; name: string; color?: string }
): Color[] {
	const storedByStep = new Map<string, Color>();
	for (const row of filterVariationsByBase(all, baseSlug)) {
		const p = parsePaletteShadeSlug(String(row.slug ?? ''));
		if (p) {
			storedByStep.set(p.shadeStep, row);
		}
	}
	return COLOR_SHADE_STEPS.map((step) => {
		const stepStr = String(step);
		if (step === COLOR_SHADE_ANCHOR_STEP) {
			return {
				...colorPaletteRowFromRepeaterFields({
					slug: shadeVariationSlug(baseSlug, stepStr),
					name: stepStr,
					color: mainPreset.color ?? '#000000',
					isVisible: true,
				}),
				renderRepeaterItem: false,
			} as Color;
		}
		const row = storedByStep.get(stepStr);
		if (row) {
			return row;
		}
		return {
			...colorPaletteRowFromRepeaterFields({
				slug: shadeVariationSlug(baseSlug, stepStr),
				name: stepStr,
				color: '#000000',
				isVisible: true,
			}),
			renderRepeaterItem: false,
		} as Color;
	});
}

/**
 * Shade rows match convertRepeaterValueToColors; parent linkage is encoded in slug (`*-shade-{step}`).
 */
export function buildVariationPresetsForBase(
	preset: { slug: string; name: string },
	shades: ColorShadesMap
): Color[] {
	const { slug: parentSlug } = preset;
	return COLOR_SHADE_STEPS.filter(
		(step) => step !== COLOR_SHADE_ANCHOR_STEP
	).map((step) => {
		const stepStr = String(step);
		const hex = shades[stepStr] ?? '#000000';
		return {
			...colorPaletteRowFromRepeaterFields({
				slug: shadeVariationSlug(parentSlug, step),
				name: stepStr,
				color: hex,
				isVisible: true,
			}),
			renderRepeaterItem: false,
		};
	});
}

export function rebuildVariationsFromMainColor(
	preset: { slug: string; name: string },
	mainColor: string
): Color[] {
	return buildVariationPresetsForBase(preset, generateColorShades(mainColor));
}
