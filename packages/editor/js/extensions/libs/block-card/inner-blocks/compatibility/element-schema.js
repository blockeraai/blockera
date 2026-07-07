// @flow

/**
 * WordPress theme.json 6.9 — stylesProperties on elements.
 *
 * @see https://raw.githubusercontent.com/WordPress/gutenberg/wp/6.9/schemas/json/theme.json
 */

/** Top-level style keys allowed on `styles.elements.*` */
export const WP_ELEMENT_STYLE_PROPERTY_KEYS: Array<string> = [
	'background',
	'border',
	'color',
	'css',
	'dimensions',
	'filter',
	'outline',
	'shadow',
	'spacing',
	'typography',
];

/** Pseudo selectors on link/button elements (theme.json / global styles). */
export const WP_ELEMENT_PSEUDO_STATES: Array<string> = [
	':hover',
	':focus',
	':focus-visible',
	':active',
	':visited',
	':link',
	':any-link',
];

/**
 * WP element pseudo states imported into inner-block `blockeraBlockStates`.
 * Blockera state id (e.g. `hover`) maps to theme.json `:hover` on `styles.elements.*`.
 */
export const INNER_BLOCK_WP_ELEMENT_PSEUDO_STATES: Array<string> = ['hover'];

/** Compat keys that already target a pseudo state (skip auto `:hover` clones). */
export const INNER_BLOCK_PSEUDO_DEDICATED_COMPAT_KEYS: Array<string> = [
	'text-decoration-hover',
];

export const ELEMENT_COLOR_COMPAT_KEYS: Array<string> = [
	'font-color',
	'font-color-hover',
	'background-color',
	'background-image',
];

export const ELEMENT_TYPOGRAPHY_COMPAT_KEYS: Array<string> = [
	'font-family',
	'font-size',
	'line-height',
	'letter-spacing',
	'text-transform',
	'text-decoration',
	'text-decoration-hover',
	'font-appearance',
	'text-orientation',
	'text-align',
];

export const ELEMENT_BORDER_SHADOW_COMPAT_KEYS: Array<string> = [
	'border',
	'border-radius',
	'box-shadow',
];

/**
 * WordPress theme.json border.* property names (stylesProperties.border).
 *
 * @see https://github.com/WordPress/gutenberg/blob/wp/6.9/schemas/json/theme.json
 */
export const WP_BORDER_STYLE_PROPERTY_KEYS: Array<string> = [
	'color',
	'style',
	'width',
	'radius',
	'top',
	'right',
	'bottom',
	'left',
];

/** Registry keys that mirror `blockeraBorder` (gate: dataCompatibility `border`). */
export const BLOCKERA_BORDER_COMPAT_KEYS: Array<string> = [
	'border-color',
	'border-style',
	'border-width',
];

export const ELEMENT_SPACING_COMPAT_KEYS: Array<string> = ['spacing', 'gap'];

export const ELEMENT_DIMENSIONS_COMPAT_KEYS: Array<string> = [
	'min-height',
	'aspect-ratio',
];

export const ELEMENT_CUSTOM_CSS_COMPAT_KEYS: Array<string> = ['custom-css'];

/** Keys handled by dedicated element-* modules (not the generic registry loop). */
export const ELEMENT_SPECIAL_COMPAT_KEYS: Array<string> = [
	'font-color',
	'font-color-hover',
	'background-color',
	'background-image',
];

export const ELEMENT_REGISTRY_COMPAT_KEYS: Array<string> = [
	...ELEMENT_TYPOGRAPHY_COMPAT_KEYS,
	...ELEMENT_BORDER_SHADOW_COMPAT_KEYS,
	...ELEMENT_SPACING_COMPAT_KEYS,
	...ELEMENT_DIMENSIONS_COMPAT_KEYS,
	...ELEMENT_CUSTOM_CSS_COMPAT_KEYS,
];

export const ELEMENT_LINK_COMPAT_KEYS: Array<string> = [
	...ELEMENT_COLOR_COMPAT_KEYS.filter((key) => key !== 'background-image'),
	'text-decoration',
	'text-decoration-hover',
];

export const ELEMENT_HEADING_COMPAT_KEYS: Array<string> = [
	...ELEMENT_COLOR_COMPAT_KEYS,
	...ELEMENT_TYPOGRAPHY_COMPAT_KEYS,
];

export const ELEMENT_BUTTON_COMPAT_KEYS: Array<string> = [
	...ELEMENT_COLOR_COMPAT_KEYS,
	...ELEMENT_TYPOGRAPHY_COMPAT_KEYS,
	...ELEMENT_BORDER_SHADOW_COMPAT_KEYS,
	...ELEMENT_SPACING_COMPAT_KEYS,
	...ELEMENT_DIMENSIONS_COMPAT_KEYS,
	...ELEMENT_CUSTOM_CSS_COMPAT_KEYS,
];

/**
 * WordPress theme.json typography.* property names (stylesProperties.typography).
 */
export const WP_TYPOGRAPHY_PROPERTY_KEYS: Array<string> = [
	'fontFamily',
	'fontSize',
	'fontStyle',
	'fontWeight',
	'letterSpacing',
	'lineHeight',
	'textAlign',
	'textColumns',
	'textDecoration',
	'writingMode',
	'textTransform',
];

/**
 * Blockera feature id + theme.json element path for registry entries.
 *
 * `wpFeatureId` is a dot path relative to an element node (e.g. `typography.fontSize`).
 * Nested paths use dot notation (`border.color`, `typography.fontSize`).
 */
export type InnerBlockFeatureRef = {
	key: string,
	blockeraFeatureId: string,
	wpFeatureId: string,
	styleSources: Array<string>,
	/**
	 * When true, the value at `wpFeatureId` on the compat result is merged into the
	 * existing inner-block `blockeraFeatureId` attribute (multi-facet composites).
	 */
	mergesIntoBlockeraFeature?: boolean,
};

export const INNER_BLOCK_FEATURE_REFS: Array<InnerBlockFeatureRef> = [
	{
		key: 'font-family',
		blockeraFeatureId: 'blockeraFontFamily',
		wpFeatureId: 'typography.fontFamily',
		styleSources: ['typography'],
	},
	{
		key: 'font-size',
		blockeraFeatureId: 'blockeraFontSize',
		wpFeatureId: 'typography.fontSize',
		styleSources: ['typography'],
	},
	{
		key: 'line-height',
		blockeraFeatureId: 'blockeraLineHeight',
		wpFeatureId: 'typography.lineHeight',
		styleSources: ['typography'],
	},
	{
		key: 'text-align',
		blockeraFeatureId: 'blockeraTextAlign',
		wpFeatureId: 'typography.textAlign',
		styleSources: ['typography'],
	},
	{
		key: 'text-decoration',
		blockeraFeatureId: 'blockeraTextDecoration',
		wpFeatureId: 'typography.textDecoration',
		styleSources: ['typography'],
	},
	{
		key: 'text-decoration-hover',
		blockeraFeatureId: 'blockeraTextDecoration',
		wpFeatureId: 'typography.textDecoration',
		styleSources: ['typography'],
	},
	{
		key: 'font-appearance',
		blockeraFeatureId: 'blockeraFontAppearance',
		wpFeatureId: 'typography.fontWeight',
		styleSources: ['typography'],
	},
	{
		key: 'text-transform',
		blockeraFeatureId: 'blockeraTextTransform',
		wpFeatureId: 'typography.textTransform',
		styleSources: ['typography'],
	},
	{
		key: 'letter-spacing',
		blockeraFeatureId: 'blockeraLetterSpacing',
		wpFeatureId: 'typography.letterSpacing',
		styleSources: ['typography'],
	},
	{
		key: 'text-orientation',
		blockeraFeatureId: 'blockeraTextOrientation',
		wpFeatureId: 'typography.writingMode',
		styleSources: ['typography'],
	},
	{
		key: 'border-color',
		blockeraFeatureId: 'blockeraBorder',
		wpFeatureId: 'border.color',
		styleSources: ['border'],
		mergesIntoBlockeraFeature: true,
	},
	{
		key: 'border-style',
		blockeraFeatureId: 'blockeraBorder',
		wpFeatureId: 'border.style',
		styleSources: ['border'],
		mergesIntoBlockeraFeature: true,
	},
	{
		key: 'border-width',
		blockeraFeatureId: 'blockeraBorder',
		wpFeatureId: 'border.width',
		styleSources: ['border'],
		mergesIntoBlockeraFeature: true,
	},
	{
		key: 'border-radius',
		blockeraFeatureId: 'blockeraBorderRadius',
		wpFeatureId: 'border.radius',
		styleSources: ['border'],
	},
	{
		key: 'box-shadow',
		blockeraFeatureId: 'blockeraBoxShadow',
		wpFeatureId: 'shadow',
		styleSources: ['shadow'],
	},
	{
		key: 'spacing',
		blockeraFeatureId: 'blockeraSpacing',
		wpFeatureId: 'spacing',
		styleSources: ['spacing'],
	},
	{
		key: 'gap',
		blockeraFeatureId: 'blockeraGap',
		wpFeatureId: 'spacing.blockGap',
		styleSources: ['spacing'],
	},
	{
		key: 'min-height',
		blockeraFeatureId: 'blockeraMinHeight',
		wpFeatureId: 'dimensions.minHeight',
		styleSources: ['dimensions'],
	},
	{
		key: 'aspect-ratio',
		blockeraFeatureId: 'blockeraRatio',
		wpFeatureId: 'dimensions.aspectRatio',
		styleSources: ['dimensions'],
	},
	{
		key: 'custom-css',
		blockeraFeatureId: 'blockeraCustomCSS',
		wpFeatureId: 'css',
		styleSources: ['css'],
	},
];

/**
 * dataCompatibility gate key for a registry entry (border facets share `border`).
 */
export const resolveInnerBlockCompatGateKey = (compatKey: string): string => {
	if (BLOCKERA_BORDER_COMPAT_KEYS.includes(compatKey)) {
		return 'border';
	}

	return compatKey;
};
