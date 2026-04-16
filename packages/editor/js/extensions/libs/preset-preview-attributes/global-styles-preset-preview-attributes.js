// @flow

/**
 * Maps global-styles theme.json presets to Blockera block attributes so the style engine
 * (`StateStyle` / computed CSS props) produce canvas preview CSS.
 *
 * Blockera dependencies
 */
import {
	getValueAddonRealValue,
	parseCssTextShadowToRepeaterValue,
} from '@blockera/controls';
import {
	formatControlItemsToCssBoxShadow,
	parseCssBoxShadowToRepeaterValue,
} from '../border-and-shadow/compatibilities/shadow';
import { joinTransformCssFromRepeaterMap } from '../effects/transform-repeater-to-css';

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
 * @param {Object} blockeraFilter Repeater map for `blockeraFilter`.
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesFilterPresetPreviewAttributes(
	blockeraFilter: Object | null | void
): Object {
	if (!blockeraFilter || !Object.keys(blockeraFilter).length) {
		return {};
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
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesBorderPresetPreviewAttributes(
	border: Object | null | void
): Object {
	if (!border || typeof border !== 'object') {
		return {};
	}

	return {
		blockeraBorder: {
			all: border,
			type: 'all',
		},
	};
}

/**
 * @param {string|number|void} size Border-radius preset size.
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesBorderRadiusPresetPreviewAttributes(
	size: string | number | null | void
): Object {
	const v = getValueAddonRealValue((size: any));
	const s = v !== undefined && v !== null ? String(v).trim() : '';
	if (!s) {
		return {};
	}

	return {
		blockeraBorderRadius: {
			type: 'all',
			all: s,
		},
	};
}

/**
 * @param {string|void} size Spacing size preset value.
 * @param {'padding' | 'margin' | 'gap' | 'width' | 'height'} [usage='padding']
 * @return {Object} Partial attributes, or empty object.
 */
export function getGlobalStylesSpacingSizePresetPreviewAttributes(
	size: string | null | void,
	usage?: 'padding' | 'margin' | 'gap' | 'width' | 'height'
): Object {
	const s = getValueAddonRealValue((size: any));
	const t = s !== undefined && s !== null ? String(s).trim() : '';
	if (!t) {
		return {};
	}

	const kind = usage ?? 'padding';

	switch (kind) {
		case 'padding':
			return {
				blockeraSpacing: {
					padding: side(t),
				},
			};

		case 'margin':
			return {
				blockeraSpacing: {
					margin: side(t),
				},
			};

		case 'gap':
			return {
				blockeraGap: {
					lock: true,
					gap: t,
				},
			};

		case 'width':
			return { blockeraWidth: t };

		case 'height':
			return { blockeraHeight: t };

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
 * @param {'color' | 'background'} [usage='background']
 * @return {Object} Partial attributes, or empty object. Gradient fills return {} (use canvas declarations).
 */
export function getGlobalStylesColorPresetPreviewAttributes(
	variable: {
		color?: string,
		type?: string,
	},
	usage?: 'color' | 'background'
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

	if (isGradient) {
		return {};
	}

	const kind = usage ?? 'background';

	if (kind === 'color') {
		return { blockeraFontColor: color };
	}

	return { blockeraBackgroundColor: color };
}
