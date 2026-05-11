/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
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
	paintPartFromStoredPaletteColorString,
} from './utils';
import { resolveStoredColorForGenerateColorShades } from './resolve-color-for-shade-generator';

export function shadeVariationSlug(
	baseSlug: string,
	step: number | string
): string {
	return `${baseSlug}-shade-${step}`;
}

/**
 * Human-readable label for a shade step (50–950), relative to the parent preset name.
 */
export function formatShadePresetName(
	parentPresetName: string,
	step: number | string
): string {
	return sprintf(
		/* translators: 1: parent color preset name, 2: shade step number (e.g. 600). */
		__('%1$s - Shade %2$s', 'blockera'),
		parentPresetName,
		String(step)
	);
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
		return p !== null && p.baseSlug === baseSlug;
	});
}

export function variationsToStackMap(rows: Color[]): ColorShadesMap {
	const map: ColorShadesMap = {};
	if (rows.length === COLOR_SHADE_STEPS.length) {
		for (let i = 0; i < COLOR_SHADE_STEPS.length; i++) {
			const stepStr = String(COLOR_SHADE_STEPS[i]);
			const colorRaw = rows[i]?.color;
			map[stepStr] = paintPartFromStoredPaletteColorString(
				typeof colorRaw === 'string' ? colorRaw : ''
			);
		}
		return map;
	}
	for (const row of rows) {
		const p = parsePaletteShadeSlug(String(row.slug ?? ''));
		if (p) {
			map[p.shadeStep] = paintPartFromStoredPaletteColorString(
				typeof row.color === 'string' ? row.color : ''
			);
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

function buildDisplayShadeRamp(
	all: Color[],
	baseSlug: string,
	mainPreset: { slug: string; name: string; color?: string },
	withStackMap: boolean
): { ramp: Color[]; stackMap?: ColorShadesMap } {
	const storedByStep = new Map<string, Color>();
	for (const row of filterVariationsByBase(all, baseSlug)) {
		const p = parsePaletteShadeSlug(String(row.slug ?? ''));
		if (p) {
			storedByStep.set(p.shadeStep, row);
		}
	}
	const ramp: Color[] = [];
	const stackMap: ColorShadesMap | undefined = withStackMap ? {} : undefined;

	for (const step of COLOR_SHADE_STEPS) {
		const stepStr = String(step);
		let row: Color;
		const stored = storedByStep.get(stepStr);
		if (stored) {
			row = {
				...stored,
				name: stepStr,
			};
		} else if (step === COLOR_SHADE_ANCHOR_STEP) {
			row = {
				...colorPaletteRowFromRepeaterFields({
					slug: shadeVariationSlug(baseSlug, stepStr),
					name: stepStr,
					color: mainPreset.color ?? '#000000',
					isVisible: true,
				}),
				renderRepeaterItem: false,
			} as Color;
		} else {
			row = {
				...colorPaletteRowFromRepeaterFields({
					slug: shadeVariationSlug(baseSlug, stepStr),
					name: stepStr,
					color: '#000000',
					isVisible: true,
				}),
				renderRepeaterItem: false,
			} as Color;
		}
		ramp.push(row);
		if (stackMap) {
			stackMap[stepStr] = paintPartFromStoredPaletteColorString(
				typeof row.color === 'string' ? row.color : ''
			);
		}
	}

	return { ramp, stackMap };
}

/**
 * Same ramp as {@link getDisplayShadeRamp}, plus stack paint map in one pass (avoids a second
 * slug parse / composite split via {@link variationsToStackMap}).
 */
export function getDisplayShadeRampWithStackMap(
	all: Color[],
	baseSlug: string,
	mainPreset: { slug: string; name: string; color?: string }
): { ramp: Color[]; stackMap: ColorShadesMap } {
	const { ramp, stackMap } = buildDisplayShadeRamp(
		all,
		baseSlug,
		mainPreset,
		true
	);
	return { ramp, stackMap: stackMap ?? {} };
}

/**
 * Full ramp for UI (indicator stack, nested shade rows): persisted shade rows for each step when
 * present; missing anchor (500) is synthesized from the main preset color.
 */
export function getDisplayShadeRamp(
	all: Color[],
	baseSlug: string,
	mainPreset: { slug: string; name: string; color?: string }
): Color[] {
	return buildDisplayShadeRamp(all, baseSlug, mainPreset, false).ramp;
}

/**
 * Shade rows match convertRepeaterValueToColors; parent linkage is encoded in slug (`*-shade-{step}`).
 * Includes the anchor step (500) as a persisted row alongside other steps.
 */
export function buildVariationPresetsForBase(
	preset: { slug: string; name: string },
	shades: ColorShadesMap
): Color[] {
	const { slug: parentSlug } = preset;
	return COLOR_SHADE_STEPS.map((step) => {
		const stepStr = String(step);
		const hex = shades[stepStr] ?? '#000000';
		return {
			...colorPaletteRowFromRepeaterFields({
				slug: shadeVariationSlug(parentSlug, step),
				name: formatShadePresetName(preset.name, stepStr),
				color: hex,
				isVisible: true,
			}),
			renderRepeaterItem: false,
		};
	});
}

export function rebuildVariationsFromMainColor(
	preset: { slug: string; name: string },
	mainColor: string,
	options?: { variablePickerType?: string; blockName?: string }
): Color[] {
	const hex = resolveStoredColorForGenerateColorShades(
		mainColor,
		preset.slug,
		options
	);
	return buildVariationPresetsForBase(preset, generateColorShades(hex));
}
