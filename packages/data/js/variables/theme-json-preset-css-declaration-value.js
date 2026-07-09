// @flow
/**
 * Theme.json preset row → CSS custom-property declaration value.
 *
 * Aligns with global-styles-ui preset screens and
 * {@link serializeGlobalStylePresetItemValue} / variable-picker mappers.
 */
import { serializeGlobalStylePresetItemValue } from './preset-variable-picker-payload';
import { textShadowPresetItemsToCss } from './text-shadow-preset-css';
import { normalizeThemeJsonPresetLeafForScalarUi } from './theme-json-variable-resolution';
import {
	isValueAddonShape,
	resolveStoredScalarForCssDeclaration,
} from './value-addon-shape';

/** cssVarInfix → variable-picker / {@link serializeGlobalStylePresetItemValue} type. */
export const CSS_VAR_INFIX_TO_PRESET_VARIABLE_TYPE: {
	[string]: string,
} = {
	color: 'color',
	gradient: 'linear-gradient',
	shadow: 'shadow',
	'font-size': 'font-size',
	'line-height': 'line-height',
	'font-family': 'font-family',
	spacing: 'spacing',
	'width-size': 'width-size',
	'border-radius': 'border-radius',
	dimension: 'spacing',
	border: 'border',
	transition: 'transition',
	transform: 'transform',
	filter: 'filter',
	'text-shadow': 'text-shadow',
};

const TRANSITION_TIMING_MAP: { [string]: string } = {
	linear: 'linear',
	ease: 'ease',
	'ease-in': 'ease-in',
	'ease-out': 'ease-out',
	'ease-in-out': 'ease-in-out',
	'ease-in-quad': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
	'ease-in-cubic': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
	'ease-in-quart': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
	'ease-in-quint': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
	'ease-in-sine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
	'ease-in-expo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
	'ease-in-circ': 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
	'ease-in-back': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
	'ease-out-quad': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
	'ease-out-cubic': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
	'ease-out-quart': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
	'ease-out-quint': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
	'ease-out-sine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
	'ease-out-expo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
	'ease-out-circ': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
	'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
	'ease-in-out-quad': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
	'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
	'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
	'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
	'ease-in-out-sine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
	'ease-in-out-expo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
	'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
	'ease-in-out-back': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
};

function resolveTransitionTiming(value: mixed): string {
	if (typeof value !== 'string' || !value) {
		return 'ease';
	}
	return TRANSITION_TIMING_MAP[value] || value;
}

function resolveBorderColorString(color: mixed): string {
	if (color === undefined || color === '') {
		return '';
	}
	if (typeof color === 'string') {
		return color.trim();
	}
	if (isValueAddonShape(color)) {
		return resolveStoredScalarForCssDeclaration(color);
	}
	if (
		color &&
		typeof color === 'object' &&
		!Array.isArray(color) &&
		typeof (color: Object).settings?.value === 'string'
	) {
		return String((color: Object).settings.value).trim();
	}
	return '';
}

function borderSerializedValueToCss(serialized: mixed): string {
	if (typeof serialized === 'string') {
		return serialized.trim();
	}
	if (
		!serialized ||
		typeof serialized !== 'object' ||
		Array.isArray(serialized)
	) {
		return '';
	}
	const border = (serialized: Object);
	const width = String(border.width ?? '').trim();
	const style = String(border.style ?? '').trim();
	const color = resolveBorderColorString(border.color);
	const parts: Array<string> = [];
	if (width) {
		parts.push(width);
	}
	if (style) {
		parts.push(style);
	}
	if (color) {
		parts.push(color);
	}
	return parts.join(' ');
}

function transitionItemsToCss(items: mixed): string {
	if (!Array.isArray(items)) {
		return '';
	}
	const parts: Array<string> = [];
	for (const row of items) {
		if (!row || typeof row !== 'object') {
			continue;
		}
		const r = (row: Object);
		if (r.isVisible === false) {
			continue;
		}
		const property = typeof r.type === 'string' && r.type ? r.type : 'all';
		const duration =
			typeof r.duration === 'string' && r.duration ? r.duration : '500ms';
		const delay = typeof r.delay === 'string' && r.delay ? r.delay : '0ms';
		const timing = resolveTransitionTiming(r.timing);
		parts.push(`${property} ${duration} ${timing} ${delay}`);
	}
	return parts.join(', ');
}

function transformItemsToCss(items: mixed): string {
	if (!Array.isArray(items)) {
		return '';
	}
	const parts: Array<string> = [];
	for (const row of items) {
		if (!row || typeof row !== 'object') {
			continue;
		}
		const r = (row: Object);
		if (r.isVisible === false) {
			continue;
		}
		switch (r.type) {
			case 'move':
				parts.push(
					`translate3d(${String(r['move-x'] ?? '0px')}, ${String(
						r['move-y'] ?? '0px'
					)}, ${String(r['move-z'] ?? '0px')})`
				);
				break;
			case 'scale':
				parts.push(
					`scale3d(${String(r.scale ?? '100%')}, ${String(
						r.scale ?? '100%'
					)}, 50%)`
				);
				break;
			case 'rotate':
				parts.push(
					`rotateX(${String(r['rotate-x'] ?? '0deg')}) rotateY(${String(
						r['rotate-y'] ?? '0deg'
					)}) rotateZ(${String(r['rotate-z'] ?? '0deg')})`
				);
				break;
			case 'skew':
				parts.push(
					`skew(${String(r['skew-x'] ?? '0deg')}, ${String(
						r['skew-y'] ?? '0deg'
					)})`
				);
				break;
			default:
				break;
		}
	}
	return parts.join(' ');
}

function filterItemsToCss(items: mixed): string {
	if (!Array.isArray(items)) {
		return '';
	}
	const parts: Array<string> = [];
	for (const row of items) {
		if (!row || typeof row !== 'object') {
			continue;
		}
		const r = (row: Object);
		if (r.isVisible === false) {
			continue;
		}
		if (r.type === 'drop-shadow') {
			parts.push(
				`drop-shadow(${String(
					r['drop-shadow-x'] ?? '0px'
				)} ${String(r['drop-shadow-y'] ?? '0px')} ${String(
					r['drop-shadow-blur'] ?? '0px'
				)} ${String(r['drop-shadow-color'] ?? '#000')})`
			);
			continue;
		}
		if (typeof r.type === 'string' && r.type) {
			parts.push(`${r.type}(${String(r[r.type] ?? '')})`);
		}
	}
	return parts.join(' ');
}

function repeaterLikeItemsToCss(
	serialized: mixed,
	variableType: string
): string {
	if (
		!serialized ||
		typeof serialized !== 'object' ||
		Array.isArray(serialized)
	) {
		return '';
	}
	const items = (serialized: Object).items;
	if (typeof items === 'string' && items.trim()) {
		return items.trim();
	}
	if (!Array.isArray(items)) {
		return '';
	}
	switch (variableType) {
		case 'text-shadow':
			return textShadowPresetItemsToCss(items);
		case 'transition':
			return transitionItemsToCss(items);
		case 'transform':
			return transformItemsToCss(items);
		case 'filter':
			return filterItemsToCss(items);
		case 'shadow': {
			const layers: Array<string> = [];
			for (const layer of items) {
				if (typeof layer === 'string' && layer.trim()) {
					layers.push(layer.trim());
				}
			}
			return layers.join(', ');
		}
		default:
			return '';
	}
}

/**
 * Converts {@link serializeGlobalStylePresetItemValue} output into a CSS declaration value.
 */
export function globalStylePresetSerializedValueToCss(
	serialized: mixed,
	variableType: string
): string {
	if (serialized === null || serialized === undefined) {
		return '';
	}

	switch (variableType) {
		case 'line-height':
		case 'width-size':
		case 'spacing':
		case 'font-size':
		case 'border-radius':
		case 'color':
		case 'linear-gradient':
		case 'radial-gradient':
			return typeof serialized === 'string' ? serialized.trim() : '';

		case 'border':
			return borderSerializedValueToCss(serialized);

		case 'shadow':
		case 'text-shadow':
		case 'transition':
		case 'transform':
		case 'filter':
			return repeaterLikeItemsToCss(serialized, variableType);

		default:
			return typeof serialized === 'string'
				? String(serialized).trim()
				: '';
	}
}

/**
 * Resolves a theme.json preset row to the value half of a `--wp--preset--*` declaration.
 *
 * @param preset Raw preset from settings.*.{default|theme|custom}.
 * @param cssVarInfix Preset bucket (`line-height`, `border`, `text-shadow`, …).
 */
export function resolveThemeJsonPresetCssDeclarationValue(
	preset: { +[string]: mixed },
	cssVarInfix: string
): string {
	if (!preset || typeof preset !== 'object' || Array.isArray(preset)) {
		return '';
	}
	if (preset.isVisible === false) {
		return '';
	}

	const variableType = CSS_VAR_INFIX_TO_PRESET_VARIABLE_TYPE[cssVarInfix];
	if (!variableType) {
		return normalizeThemeJsonPresetLeafForScalarUi(cssVarInfix, preset);
	}

	if (variableType === 'shadow' || variableType === 'text-shadow') {
		const direct = String(preset.shadow ?? '').trim();
		if (direct) {
			return direct;
		}
	}

	const serialized = serializeGlobalStylePresetItemValue(
		preset,
		variableType
	);
	return globalStylePresetSerializedValueToCss(serialized, variableType);
}
