/**
 * Blockera dependencies
 */
import { inferPresetCssVarInfixForPaintVariablePickerType } from '@blockera/data';

/**
 * Internal dependencies
 */
import {
	compositeResolvedValueFromStoredPlainPresetInput,
	resolveThemeJsonPresetScalarForGlobalStylesUi,
	splitStoredCompositePlainPresetValue,
} from '../theme-json-plain-preset';

/**
 * Coerces resolved CSS color strings to `#RRGGBB` for `generateColorShades`.
 * Unknown shapes fall back to `#000000`.
 */
function cssColorToHexForShadeGenerator(input: string): string {
	const s = input.trim();
	if (!s) {
		return '#000000';
	}
	if (/^#[0-9A-Fa-f]{6}$/.test(s)) {
		return s.toUpperCase();
	}
	if (/^#[0-9A-Fa-f]{3}$/.test(s)) {
		const h = s.slice(1);
		return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toUpperCase();
	}
	const m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(s);
	if (m) {
		const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
		const r = clamp(Number(m[1]));
		const g = clamp(Number(m[2]));
		const b = clamp(Number(m[3]));
		return (
			'#' +
			[r, g, b]
				.map((v) => v.toString(16).padStart(2, '0'))
				.join('')
				.toUpperCase()
		);
	}
	return '#000000';
}

export type ResolveStoredColorForGenerateColorShadesOptions = {
	variablePickerType?: string;
	blockName?: string;
};

/**
 * Resolves persisted palette `color` (plain slug, variable token, composite `paint,slug`, etc.)
 * to a concrete hex base before `generateColorShades`.
 */
export function resolveStoredColorForGenerateColorShades(
	stored: string | undefined,
	presetSlug: string,
	options?: ResolveStoredColorForGenerateColorShadesOptions
): string {
	const raw = typeof stored === 'string' ? stored.trim() : '';
	if (raw === '') {
		return '#000000';
	}

	const presetCssVarInfix =
		inferPresetCssVarInfixForPaintVariablePickerType(
			options?.variablePickerType
		) ?? 'color';

	let paintScalar = raw;
	if (splitStoredCompositePlainPresetValue(raw)) {
		paintScalar = compositeResolvedValueFromStoredPlainPresetInput(raw);
	} else {
		paintScalar = resolveThemeJsonPresetScalarForGlobalStylesUi({
			storedScalar: raw,
			presetSlug,
			blockName:
				typeof options?.blockName === 'string' ? options.blockName : '',
			presetCssVarInfix,
			variablePickerType: options?.variablePickerType,
		});
	}

	return cssColorToHexForShadeGenerator(
		typeof paintScalar === 'string'
			? paintScalar
			: String(paintScalar ?? '')
	);
}
