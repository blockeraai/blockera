// @flow

/**
 * Block-style preview strings for global-styles preset rows, using the same CSS generators
 * and transform helper as block attributes (`styles.js`, css-generators), including value-addon resolution.
 *
 * Blockera dependencies
 */
import {
	getValueAddonRealValue,
	parseCssTextShadowToRepeaterValue,
} from '@blockera/controls';
import { createCssDeclarations } from '../../../style-engine';
import { WidthGenerator } from '../size/css-generators/width-generator';
import { BoxShadowGenerator } from '../border-and-shadow/css-generators/box-shadow-genrator';
import { BoxBorderGenerator } from '../border-and-shadow/css-generators/box-border-generator';
import { TextShadowGenerator } from '../typography/css-generators/text-shadow-generator';
import {
	formatControlItemsToCssBoxShadow,
	parseCssBoxShadowToRepeaterValue,
} from '../border-and-shadow/compatibilities/shadow';
import { FilterGenerator } from '../effects/css-generators/filter-generator';
import { TransitionGenerator } from '../effects/css-generators/transition-generator';
import { joinTransformCssFromRepeaterMap } from '../effects/transform-repeater-to-css';

const PREVIEW_OPTIONS = { important: true };

/**
 * @param {Object} preset theme.json shadow preset (`shadow` string and/or `items`).
 * @return {string} CSS declarations string for BlockStyle preview, or empty.
 */
export function getGlobalStylesShadowPresetPreviewCss(
	preset: Object | null | void
): string {
	if (!preset || typeof preset !== 'object') {
		return '';
	}

	let css = '';
	if (typeof preset.shadow === 'string' && preset.shadow.trim()) {
		css = preset.shadow.trim();
	} else if (Array.isArray(preset.items) && preset.items.length) {
		css = formatControlItemsToCssBoxShadow(preset.items);
	}

	if (!css) {
		return '';
	}

	const blockeraBoxShadow = parseCssBoxShadowToRepeaterValue(css);
	if (!blockeraBoxShadow || !Object.keys(blockeraBoxShadow).length) {
		return '';
	}

	return BoxShadowGenerator(
		'blockeraBoxShadow',
		{ attributes: { blockeraBoxShadow } },
		PREVIEW_OPTIONS
	);
}

/**
 * @param {string} css Resolved text-shadow CSS (e.g. from global-styles text-shadow utils).
 * @return {string} CSS declarations string for BlockStyle preview, or empty.
 */
export function getGlobalStylesTextShadowCssPreviewCss(css: string): string {
	const raw = String(css ?? '').trim();
	if (!raw) {
		return '';
	}

	const blockeraTextShadow = parseCssTextShadowToRepeaterValue(raw);
	if (!blockeraTextShadow || !Object.keys(blockeraTextShadow).length) {
		return '';
	}

	return TextShadowGenerator(
		'blockeraTextShadow',
		{ attributes: { blockeraTextShadow } },
		PREVIEW_OPTIONS
	);
}

/**
 * @param {Object} blockeraTransition Repeater map (`itemsToRepeaterRecord` for transition presets).
 * @return {string} CSS declarations for transition preview, or empty.
 */
export function getGlobalStylesTransitionPresetPreviewCss(
	blockeraTransition: Object | null | void
): string {
	if (!blockeraTransition || !Object.keys(blockeraTransition).length) {
		return '';
	}

	return TransitionGenerator(
		'blockeraTransition',
		{ attributes: { blockeraTransition } },
		PREVIEW_OPTIONS
	);
}

/**
 * @param {Object} blockeraFilter Repeater map for `blockeraFilter`.
 * @return {string} CSS declarations for filter preview, or empty.
 */
export function getGlobalStylesFilterPresetPreviewCss(
	blockeraFilter: Object | null | void
): string {
	if (!blockeraFilter || !Object.keys(blockeraFilter).length) {
		return '';
	}

	return FilterGenerator(
		'blockeraFilter',
		{ attributes: { blockeraFilter } },
		PREVIEW_OPTIONS
	);
}

/**
 * @param {Object} blockeraTransform Repeater map (`itemsToRepeaterRecord` for transform presets).
 * @return {string} CSS declarations for transform preview, or empty.
 */
export function getGlobalStylesTransformPresetPreviewCss(
	blockeraTransform: Object | null | void
): string {
	const transformCss = joinTransformCssFromRepeaterMap(
		blockeraTransform || {}
	);
	if (!transformCss) {
		return '';
	}

	return createCssDeclarations({
		options: PREVIEW_OPTIONS,
		properties: {
			transform: transformCss,
		},
	});
}

/**
 * Flat border triple from global-styles border presets (`width` / `style` / `color`).
 *
 * @param {Object} border
 * @return {string} CSS declarations for border preview, or empty.
 */
export function getGlobalStylesBorderPresetPreviewCss(
	border: Object | null | void
): string {
	if (!border || typeof border !== 'object') {
		return '';
	}

	return BoxBorderGenerator(
		'blockeraBorder',
		{
			attributes: {
				blockeraBorder: border,
			},
		},
		PREVIEW_OPTIONS
	);
}

/**
 * @param {string|number|void} size Border-radius preset size.
 * @return {string} CSS declarations for border-radius preview, or empty.
 */
export function getGlobalStylesBorderRadiusPresetPreviewCss(
	size: string | number | null | void
): string {
	const v = getValueAddonRealValue((size: any));
	const s = v !== undefined && v !== null ? String(v).trim() : '';
	if (!s) {
		return '';
	}

	return createCssDeclarations({
		options: PREVIEW_OPTIONS,
		properties: {
			'border-radius': s,
		},
	});
}

/**
 * Mirrors `libs/layout/spacing-styles.js` updateCssProps — longhand sides, same value-addon resolution.
 *
 * @param {string} resolved Resolved spacing token (trimmed).
 * @return {Object} CSS properties map for padding sides.
 */
function getSpacingPaddingSidesPreviewProperties(resolved: string): {
	'padding-top': string,
	'padding-right': string,
	'padding-bottom': string,
	'padding-left': string,
} {
	return {
		'padding-top': resolved,
		'padding-right': resolved,
		'padding-bottom': resolved,
		'padding-left': resolved,
	};
}

/**
 * Mirrors `libs/layout/spacing-styles.js` updateCssProps margin branch (!important on right/left).
 *
 * @param {string} resolved Resolved spacing token (trimmed).
 * @return {Object} Margin longhand properties map for preview.
 */
function getSpacingMarginSidesPreviewProperties(resolved: string): Object {
	return {
		'margin-top': resolved,
		'margin-right': `${resolved} !important`,
		'margin-bottom': resolved,
		'margin-left': `${resolved} !important`,
	};
}

/**
 * Mirrors `libs/size/styles.js` getStretchValueKey for height / min-height style keys.
 *
 * @param {string} baseProp e.g. 'height'
 * @param {string} value Raw value (may be 'stretch')
 * @return {string} CSS property key (possibly compound for stretch)
 */
function getStretchPreviewPropertyKey(baseProp: string, value: string): string {
	if (value === 'stretch') {
		return `${baseProp}: 100%; ${baseProp}: -moz-available !important; ${baseProp}: -webkit-fill-available !important; ${baseProp}`;
	}

	return baseProp;
}

/**
 * Spacing size presets feed width/height/padding/margin/gap controls; preview CSS follows the same
 * paths as `spacing-styles.js`, `size/styles.js`, `layout/styles.js` gap, and `WidthGenerator`.
 *
 * @param {string|void} size Spacing size preset value.
 * @param {'padding' | 'margin' | 'gap' | 'width' | 'height'} [usage='padding'] Which control context to emulate (default: padding longhand).
 * @return {string} CSS declarations for spacing-size preview, or empty.
 */
export function getGlobalStylesSpacingSizePresetPreviewCss(
	size: string | null | void,
	usage?: 'padding' | 'margin' | 'gap' | 'width' | 'height'
): string {
	const s = getValueAddonRealValue((size: any));
	const t = s !== undefined && s !== null ? String(s).trim() : '';
	if (!t) {
		return '';
	}

	const kind = usage ?? 'padding';

	switch (kind) {
		case 'padding':
			return createCssDeclarations({
				options: PREVIEW_OPTIONS,
				properties: getSpacingPaddingSidesPreviewProperties(t),
			});

		case 'margin':
			return createCssDeclarations({
				options: PREVIEW_OPTIONS,
				properties: getSpacingMarginSidesPreviewProperties(t),
			});

		case 'gap':
			return createCssDeclarations({
				options: PREVIEW_OPTIONS,
				properties: {
					gap: t,
				},
			});

		case 'width':
			return WidthGenerator(
				'blockeraWidth',
				{
					attributes: {
						blockeraWidth: t,
						width: undefined,
					},
					supports: {},
					currentBlock: '',
				},
				PREVIEW_OPTIONS
			);

		case 'height': {
			const key = getStretchPreviewPropertyKey('height', t);
			return createCssDeclarations({
				options: PREVIEW_OPTIONS,
				properties: {
					[key]: t,
				},
			});
		}

		default:
			return '';
	}
}

/**
 * @param {string|void} size Font size preset.
 * @return {string} CSS declarations for font-size preview, or empty.
 */
export function getGlobalStylesFontSizePresetPreviewCss(
	size: string | null | void
): string {
	const s = getValueAddonRealValue((size: any));
	const t = s !== undefined && s !== null ? String(s).trim() : '';
	if (!t) {
		return '';
	}

	return createCssDeclarations({
		options: PREVIEW_OPTIONS,
		properties: {
			'font-size': t,
		},
	});
}

/**
 * @param {{ color?: string, type?: string }} variable Color / gradient preset row.
 * @param {'color' | 'background'} [usage='background'] `color` = font color; `background` = background-color (or gradient fill).
 * @return {string} CSS declarations for color or gradient preview, or empty.
 */
export function getGlobalStylesColorPresetPreviewCss(
	variable: {
		color?: string,
		type?: string,
	},
	usage?: 'color' | 'background'
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
		return createCssDeclarations({
			options: PREVIEW_OPTIONS,
			properties: {
				background: color,
			},
		});
	}

	const kind = usage ?? 'background';

	if (kind === 'color') {
		return createCssDeclarations({
			options: PREVIEW_OPTIONS,
			properties: {
				color,
			},
		});
	}

	return createCssDeclarations({
		options: PREVIEW_OPTIONS,
		properties: {
			'background-color': color,
		},
	});
}

/**
 * @param {string|void} gradient Gradient preset CSS.
 * @return {string} CSS declarations for gradient preview, or empty.
 */
export function getGlobalStylesGradientPresetPreviewCss(
	gradient: string | null | void
): string {
	const g = getValueAddonRealValue((gradient: any));
	const t = g !== undefined && g !== null ? String(g).trim() : '';
	if (!t) {
		return '';
	}

	return createCssDeclarations({
		options: PREVIEW_OPTIONS,
		properties: {
			'background-image': t,
		},
	});
}
