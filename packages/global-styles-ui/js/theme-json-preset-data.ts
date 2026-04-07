/**
 * Aligns with WordPress global styles preset metadata (theme.json / Site Editor).
 * @see wordpress/gutenberg packages/global-styles-engine/src/utils/common.ts
 */

export type PresetMetadataEntry = {
	path: string[];
	valueKey: string;
	cssVarInfix: string;
	classes?: Array<{
		classSuffix: string;
		propertyName: string;
	}>;
	valueFunc?: (preset: Record<string, unknown>) => string;
};

export const PRESET_METADATA: PresetMetadataEntry[] = [
	{
		path: ['color', 'palette'],
		valueKey: 'color',
		cssVarInfix: 'color',
		classes: [
			{ classSuffix: 'color', propertyName: 'color' },
			{
				classSuffix: 'background-color',
				propertyName: 'background-color',
			},
			{
				classSuffix: 'border-color',
				propertyName: 'border-color',
			},
		],
	},
	{
		path: ['color', 'gradients'],
		valueKey: 'gradient',
		cssVarInfix: 'gradient',
		classes: [
			{
				classSuffix: 'gradient-background',
				propertyName: 'background',
			},
		],
	},
	{
		path: ['color', 'duotone'],
		valueKey: 'colors',
		cssVarInfix: 'duotone',
		valueFunc: (preset: Record<string, unknown>) =>
			`url( '#wp-duotone-${String(preset.slug)}' )`,
		classes: [],
	},
	{
		path: ['shadow', 'presets'],
		valueKey: 'shadow',
		cssVarInfix: 'shadow',
		classes: [],
	},
	{
		path: ['typography', 'fontSizes'],
		valueKey: 'size',
		cssVarInfix: 'font-size',
		classes: [{ classSuffix: 'font-size', propertyName: 'font-size' }],
	},
	{
		path: ['typography', 'fontFamilies'],
		valueKey: 'fontFamily',
		cssVarInfix: 'font-family',
		classes: [{ classSuffix: 'font-family', propertyName: 'font-family' }],
	},
	{
		path: ['spacing', 'spacingSizes'],
		valueKey: 'size',
		cssVarInfix: 'spacing',
		valueFunc: ({ size }: Record<string, unknown>) => String(size ?? ''),
		classes: [],
	},
	{
		path: ['border', 'radiusSizes'],
		valueKey: 'size',
		cssVarInfix: 'border-radius',
		classes: [],
	},
	{
		path: ['dimensions', 'dimensionSizes'],
		valueKey: 'size',
		cssVarInfix: 'dimension',
		classes: [],
	},
];

export const STYLE_PATH_TO_CSS_VAR_INFIX: Record<string, string> = {
	'color.background': 'color',
	'color.text': 'color',
	'filter.duotone': 'duotone',
	'elements.link.color.text': 'color',
	'elements.link.:hover.color.text': 'color',
	'elements.link.typography.fontFamily': 'font-family',
	'elements.link.typography.fontSize': 'font-size',
	'elements.button.color.text': 'color',
	'elements.button.color.background': 'color',
	'elements.caption.color.text': 'color',
	'elements.button.typography.fontFamily': 'font-family',
	'elements.button.typography.fontSize': 'font-size',
	'elements.heading.color': 'color',
	'elements.heading.color.background': 'color',
	'elements.heading.typography.fontFamily': 'font-family',
	'elements.heading.gradient': 'gradient',
	'elements.heading.color.gradient': 'gradient',
	'elements.h1.color': 'color',
	'elements.h1.color.background': 'color',
	'elements.h1.typography.fontFamily': 'font-family',
	'elements.h1.color.gradient': 'gradient',
	'elements.h2.color': 'color',
	'elements.h2.color.background': 'color',
	'elements.h2.typography.fontFamily': 'font-family',
	'elements.h2.color.gradient': 'gradient',
	'elements.h3.color': 'color',
	'elements.h3.color.background': 'color',
	'elements.h3.typography.fontFamily': 'font-family',
	'elements.h3.color.gradient': 'gradient',
	'elements.h4.color': 'color',
	'elements.h4.color.background': 'color',
	'elements.h4.typography.fontFamily': 'font-family',
	'elements.h4.color.gradient': 'gradient',
	'elements.h5.color': 'color',
	'elements.h5.color.background': 'color',
	'elements.h5.typography.fontFamily': 'font-family',
	'elements.h5.color.gradient': 'gradient',
	'elements.h6.color': 'color',
	'elements.h6.color.background': 'color',
	'elements.h6.typography.fontFamily': 'font-family',
	'elements.h6.color.gradient': 'gradient',
	'color.gradient': 'gradient',
	shadow: 'shadow',
	'typography.fontSize': 'font-size',
	'typography.fontFamily': 'font-family',
};
