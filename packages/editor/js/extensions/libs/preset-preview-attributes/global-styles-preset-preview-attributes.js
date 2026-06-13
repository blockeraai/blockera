// @flow

import { BACKDROP_FILTER_PRESET_PREVIEW_USAGE } from '../effects/components/backdrop-filter';
import {
	BORDER_COLOR_PRESET_PREVIEW_USAGE,
	BORDER_PRESET_PREVIEW_USAGE_ALL,
	BORDER_PRESET_PREVIEW_USAGE_BOTTOM,
	BORDER_PRESET_PREVIEW_USAGE_LEFT,
	BORDER_PRESET_PREVIEW_USAGE_RIGHT,
	BORDER_PRESET_PREVIEW_USAGE_TOP,
} from '../border-and-shadow/components/border';
import {
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL,
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_BOTTOM_LEFT,
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_BOTTOM_RIGHT,
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_TOP_LEFT,
	BORDER_RADIUS_PRESET_PREVIEW_USAGE_TOP_RIGHT,
} from '../border-and-shadow/components/border-radius';
import {
	BACKGROUND_COLOR_PRESET_ATTRIBUTE,
	BACKGROUND_COLOR_PRESET_PREVIEW_USAGE,
} from '../background/preset-preview/color-preset-preview-usage';
import {
	FONT_COLOR_PRESET_ATTRIBUTE,
	FONT_COLOR_PRESET_PREVIEW_USAGE,
} from '../typography/preset-preview/color-preset-preview-usage';
import {
	SPACING_GAP,
	SPACING_GAP_COLUMNS,
	SPACING_GAP_ROWS,
	SPACING_MARGIN,
	SPACING_MARGIN_BOTTOM,
	SPACING_MARGIN_LEFT,
	SPACING_MARGIN_LEFT_RIGHT,
	SPACING_MARGIN_RIGHT,
	SPACING_MARGIN_TOP,
	SPACING_MARGIN_TOP_BOTTOM,
	SPACING_PADDING,
	SPACING_PADDING_BOTTOM,
	SPACING_PADDING_LEFT,
	SPACING_PADDING_LEFT_RIGHT,
	SPACING_PADDING_RIGHT,
	SPACING_PADDING_TOP,
	SPACING_PADDING_TOP_BOTTOM,
} from '../layout/preset-preview/spacing-preset-preview-usage';
import {
	BLOCKERA_HEIGHT_ATTRIBUTE,
	BLOCKERA_MAX_HEIGHT_ATTRIBUTE,
	BLOCKERA_MAX_WIDTH_ATTRIBUTE,
	BLOCKERA_MIN_HEIGHT_ATTRIBUTE,
	BLOCKERA_MIN_WIDTH_ATTRIBUTE,
	BLOCKERA_WIDTH_ATTRIBUTE,
	SPACING_HEIGHT,
	SPACING_MAX_HEIGHT,
	SPACING_MAX_WIDTH,
	SPACING_MIN_HEIGHT,
	SPACING_MIN_WIDTH,
	SPACING_WIDTH,
} from '../size/preset-preview/spacing-preset-preview-usage';
import {
	getValueAddonRealValue,
	parseCssTextShadowToRepeaterValue,
} from '@blockera/controls';
import {
	formatControlItemsToCssBoxShadow,
	parseCssBoxShadowToRepeaterValue,
} from '../border-and-shadow/compatibilities/shadow';
import { joinTransformCssFromRepeaterMap } from '../effects/transform-repeater-to-css';

/**
 * Maps global-styles theme.json presets to Blockera block attributes so the style engine
 * (`StateStyle` / computed CSS props) produce canvas preview CSS.
 */

const side = (v: string) => ({
	top: v,
	right: v,
	bottom: v,
	left: v,
});

/**
 * @param {Object} preset theme.json shadow preset (`shadow` string and/or `items`).
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesShadowPresetPreviewAttributes(
	preset: Object | null | void
): Object {
	if (!preset || typeof preset !== 'object') {
		return {};
	}

	let css = '';
	if (typeof preset.shadow === 'string' && preset.shadow.trim()) {
		css = preset.shadow.trim();
	} else if (Array.isArray(preset.items) && preset.items.length) {
		css = formatControlItemsToCssBoxShadow(preset.items);
	}

	if (!css) {
		return {};
	}

	const blockeraBoxShadow = parseCssBoxShadowToRepeaterValue(css);
	if (!blockeraBoxShadow || !Object.keys(blockeraBoxShadow).length) {
		return {};
	}

	return { blockeraBoxShadow };
}

/**
 * @param {string} css Resolved text-shadow CSS (e.g. from global-styles text-shadow utils).
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesTextShadowPreviewAttributes(
	css: string
): Object {
	const raw = String(css ?? '').trim();
	if (!raw) {
		return {};
	}

	const blockeraTextShadow = parseCssTextShadowToRepeaterValue(raw);
	if (!blockeraTextShadow || !Object.keys(blockeraTextShadow).length) {
		return {};
	}

	return { blockeraTextShadow };
}

/**
 * @param {Object} blockeraTransition Repeater map for transition presets.
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesTransitionPresetPreviewAttributes(
	blockeraTransition: Object | null | void
): Object {
	if (!blockeraTransition || !Object.keys(blockeraTransition).length) {
		return {};
	}

	return { blockeraTransition };
}

/**
 * @param {Object} blockeraFilter Repeater map for filter presets.
 * @param {string} [usage=FILTER_PRESET_PREVIEW_USAGE] Target CSS property for canvas preview.
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesFilterPresetPreviewAttributes(
	blockeraFilter: Object | null | void,
	usage?: string
): Object {
	if (!blockeraFilter || !Object.keys(blockeraFilter).length) {
		return {};
	}

	if (usage === BACKDROP_FILTER_PRESET_PREVIEW_USAGE) {
		return { blockeraBackdropFilter: blockeraFilter };
	}

	return { blockeraFilter };
}

/**
 * @param {Object} blockeraTransform Repeater map for transform presets.
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesTransformPresetPreviewAttributes(
	blockeraTransform: Object | null | void
): Object {
	const transformCss = joinTransformCssFromRepeaterMap(
		blockeraTransform || {}
	);
	if (!transformCss) {
		return {};
	}

	return {
		blockeraTransform: blockeraTransform || {},
	};
}

/**
 * @param {Object} border Border preset (`width` / `style` / `color`).
 * @param {string} [usage=BORDER_PRESET_PREVIEW_USAGE_ALL]
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesBorderPresetPreviewAttributes(
	border: Object | null | void,
	usage?: string
): Object {
	if (!border || typeof border !== 'object') {
		return {};
	}

	const sideUsage = usage ?? BORDER_PRESET_PREVIEW_USAGE_ALL;

	if (sideUsage === BORDER_PRESET_PREVIEW_USAGE_ALL) {
		return {
			blockeraBorder: {
				all: border,
				type: 'all',
			},
		};
	}

	if (sideUsage === BORDER_PRESET_PREVIEW_USAGE_TOP) {
		return { blockeraBorder: { type: 'custom', top: border } };
	}
	if (sideUsage === BORDER_PRESET_PREVIEW_USAGE_RIGHT) {
		return { blockeraBorder: { type: 'custom', right: border } };
	}
	if (sideUsage === BORDER_PRESET_PREVIEW_USAGE_BOTTOM) {
		return { blockeraBorder: { type: 'custom', bottom: border } };
	}
	if (sideUsage === BORDER_PRESET_PREVIEW_USAGE_LEFT) {
		return { blockeraBorder: { type: 'custom', left: border } };
	}

	return {};
}

/**
 * @param {string|number|void} size Border-radius preset size.
 * @param {string} [usage=BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL]
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesBorderRadiusPresetPreviewAttributes(
	size: string | number | null | void,
	usage?: string
): Object {
	const v = getValueAddonRealValue((size: any));
	const s = v !== undefined && v !== null ? String(v).trim() : '';
	if (!s) {
		return {};
	}

	const corner = usage ?? BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL;

	if (corner === BORDER_RADIUS_PRESET_PREVIEW_USAGE_ALL) {
		return {
			blockeraBorderRadius: {
				type: 'all',
				all: s,
			},
		};
	}

	if (corner === BORDER_RADIUS_PRESET_PREVIEW_USAGE_TOP_LEFT) {
		return { blockeraBorderRadius: { type: 'custom', topLeft: s } };
	}
	if (corner === BORDER_RADIUS_PRESET_PREVIEW_USAGE_TOP_RIGHT) {
		return { blockeraBorderRadius: { type: 'custom', topRight: s } };
	}
	if (corner === BORDER_RADIUS_PRESET_PREVIEW_USAGE_BOTTOM_LEFT) {
		return { blockeraBorderRadius: { type: 'custom', bottomLeft: s } };
	}
	if (corner === BORDER_RADIUS_PRESET_PREVIEW_USAGE_BOTTOM_RIGHT) {
		return { blockeraBorderRadius: { type: 'custom', bottomRight: s } };
	}

	return {};
}

/**
 * @param {string|void} size Spacing size preset value.
 * @param {string} [usage=SPACING_PADDING]
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesSpacingSizePresetPreviewAttributes(
	size: string | null | void,
	usage?: string
): Object {
	const s = getValueAddonRealValue((size: any));
	const t = s !== undefined && s !== null ? String(s).trim() : '';
	if (!t) {
		return {};
	}

	const kind = usage ?? SPACING_PADDING;

	switch (kind) {
		case SPACING_PADDING:
			return {
				blockeraSpacing: {
					padding: side(t),
				},
			};

		case SPACING_MARGIN:
			return {
				blockeraSpacing: {
					margin: side(t),
				},
			};

		case SPACING_PADDING_TOP:
			return { blockeraSpacing: { padding: { top: t } } };
		case SPACING_PADDING_RIGHT:
			return { blockeraSpacing: { padding: { right: t } } };
		case SPACING_PADDING_BOTTOM:
			return { blockeraSpacing: { padding: { bottom: t } } };
		case SPACING_PADDING_LEFT:
			return { blockeraSpacing: { padding: { left: t } } };
		case SPACING_PADDING_TOP_BOTTOM:
			return {
				blockeraSpacing: { padding: { top: t, bottom: t } },
			};
		case SPACING_PADDING_LEFT_RIGHT:
			return {
				blockeraSpacing: { padding: { left: t, right: t } },
			};

		case SPACING_MARGIN_TOP:
			return { blockeraSpacing: { margin: { top: t } } };
		case SPACING_MARGIN_RIGHT:
			return { blockeraSpacing: { margin: { right: t } } };
		case SPACING_MARGIN_BOTTOM:
			return { blockeraSpacing: { margin: { bottom: t } } };
		case SPACING_MARGIN_LEFT:
			return { blockeraSpacing: { margin: { left: t } } };
		case SPACING_MARGIN_TOP_BOTTOM:
			return {
				blockeraSpacing: { margin: { top: t, bottom: t } },
			};
		case SPACING_MARGIN_LEFT_RIGHT:
			return {
				blockeraSpacing: { margin: { left: t, right: t } },
			};

		case SPACING_GAP:
			return {
				blockeraGap: {
					lock: true,
					gap: t,
				},
			};

		case SPACING_GAP_ROWS:
			return {
				blockeraGap: {
					lock: false,
					rows: t,
				},
			};

		case SPACING_GAP_COLUMNS:
			return {
				blockeraGap: {
					lock: false,
					columns: t,
				},
			};

		case SPACING_WIDTH:
			return { [BLOCKERA_WIDTH_ATTRIBUTE]: t };

		case SPACING_MIN_WIDTH:
			return { [BLOCKERA_MIN_WIDTH_ATTRIBUTE]: t };

		case SPACING_MAX_WIDTH:
			return { [BLOCKERA_MAX_WIDTH_ATTRIBUTE]: t };

		case SPACING_HEIGHT:
			return { [BLOCKERA_HEIGHT_ATTRIBUTE]: t };

		case SPACING_MIN_HEIGHT:
			return { [BLOCKERA_MIN_HEIGHT_ATTRIBUTE]: t };

		case SPACING_MAX_HEIGHT:
			return { [BLOCKERA_MAX_HEIGHT_ATTRIBUTE]: t };

		default:
			return {};
	}
}

/**
 * @param {string|void} size Font size preset.
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesFontSizePresetPreviewAttributes(
	size: string | null | void
): Object {
	const s = getValueAddonRealValue((size: any));
	const t = s !== undefined && s !== null ? String(s).trim() : '';
	if (!t) {
		return {};
	}

	return { blockeraFontSize: t };
}

/**
 * @param {{ color?: string, type?: string }} variable Color / gradient preset row.
 * @param {string} [usage=BACKGROUND_COLOR_PRESET_PREVIEW_USAGE]
 * @return {Object} Partial attributes, or empty object. Gradient / border-color return {} (use canvas declarations).
 */
export function getGlobalStylesColorPresetPreviewAttributes(
	variable: {
		color?: string,
		type?: string,
	},
	usage?: string
): Object {
	const c = getValueAddonRealValue((variable?.color: any));
	const color = c !== undefined && c !== null ? String(c).trim() : '';
	if (!color) {
		return {};
	}

	const type = variable?.type ?? '';
	const isGradient =
		type === 'linear-gradient' ||
		type === 'radial-gradient' ||
		color.includes('gradient(');

	if (isGradient || usage === BORDER_COLOR_PRESET_PREVIEW_USAGE) {
		return {};
	}

	const kind = usage ?? BACKGROUND_COLOR_PRESET_PREVIEW_USAGE;

	if (kind === FONT_COLOR_PRESET_PREVIEW_USAGE) {
		return { [FONT_COLOR_PRESET_ATTRIBUTE]: color };
	}

	return { [BACKGROUND_COLOR_PRESET_ATTRIBUTE]: color };
}

function gradientPreviewDeclarations(gradient: string, usage?: string): string {
	const g = String(gradient ?? '').trim();
	if (!g) {
		return '';
	}

	if (usage === FONT_COLOR_PRESET_PREVIEW_USAGE) {
		return `background-image: ${g}; background-clip: text; -webkit-background-clip: text; color: transparent;`;
	}

	return `background-image: ${g}`;
}

/**
 * @param {{ color?: string, type?: string }} variable Color preset row.
 * @param {string} [usage=BACKGROUND_COLOR_PRESET_PREVIEW_USAGE]
 * @return {string} CSS declarations for canvas inject, or empty string.
 */
export function getGlobalStylesColorPresetPreviewDeclarations(
	variable: {
		color?: string,
		type?: string,
	},
	usage?: string
): string {
	const c = getValueAddonRealValue((variable?.color: any));
	const color = c !== undefined && c !== null ? String(c).trim() : '';
	if (!color) {
		return '';
	}

	const type = variable?.type ?? '';
	const isGradient =
		type === 'linear-gradient' ||
		type === 'radial-gradient' ||
		color.includes('gradient(');

	if (isGradient) {
		return getGlobalStylesColorGradientPresetPreviewDeclarations(
			variable,
			usage === BORDER_COLOR_PRESET_PREVIEW_USAGE
				? BACKGROUND_COLOR_PRESET_PREVIEW_USAGE
				: usage
		);
	}

	if (usage === BORDER_COLOR_PRESET_PREVIEW_USAGE) {
		return `border-color: ${color};`;
	}

	return '';
}

/**
 * @param {string|void} gradient Gradient preset value.
 * @param {string} [usage=BACKGROUND_COLOR_PRESET_PREVIEW_USAGE]
 * @return {string} CSS declarations for canvas inject, or empty string.
 */
export function getGlobalStylesGradientPresetPreviewDeclarations(
	gradient: string | null | void,
	usage?: string
): string {
	const g = getValueAddonRealValue((gradient: any));
	const value =
		g !== undefined && g !== null
			? String(g).trim()
			: String(gradient ?? '').trim();
	return gradientPreviewDeclarations(value, usage);
}

/**
 * @param {{ color?: string, type?: string }} variable Color gradient preset row.
 * @param {string} [usage=BACKGROUND_COLOR_PRESET_PREVIEW_USAGE]
 * @return {string} CSS declarations for canvas inject, or empty string.
 */
export function getGlobalStylesColorGradientPresetPreviewDeclarations(
	variable: {
		color?: string,
		type?: string,
	},
	usage?: string
): string {
	const c = getValueAddonRealValue((variable?.color: any));
	const color = c !== undefined && c !== null ? String(c).trim() : '';
	if (!color) {
		return '';
	}

	const kind =
		usage === BORDER_COLOR_PRESET_PREVIEW_USAGE
			? BACKGROUND_COLOR_PRESET_PREVIEW_USAGE
			: (usage ?? BACKGROUND_COLOR_PRESET_PREVIEW_USAGE);
	return gradientPreviewDeclarations(color, kind);
}
