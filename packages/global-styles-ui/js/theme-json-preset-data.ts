/**
 * Aligns with WordPress global styles preset metadata (theme.json / Site Editor).
 * @see wordpress/gutenberg packages/global-styles-engine/src/utils/common.ts
 */

/**
 * Blockera dependencies
 */
import { THEME_JSON_PRESET_METADATA_BASE } from '@blockera/data';

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

const METADATA_EXTRA_BY_INFIX: Record<
	string,
	{
		classes: NonNullable<PresetMetadataEntry['classes']>;
		valueFunc?: PresetMetadataEntry['valueFunc'];
	}
> = {
	color: {
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
	gradient: {
		classes: [
			{
				classSuffix: 'gradient-background',
				propertyName: 'background',
			},
		],
	},
	duotone: {
		classes: [],
		valueFunc: (preset: Record<string, unknown>) =>
			`url( '#wp-duotone-${String(preset.slug)}' )`,
	},
	shadow: {
		classes: [],
	},
	'font-size': {
		classes: [{ classSuffix: 'font-size', propertyName: 'font-size' }],
	},
	'line-height': {
		classes: [{ classSuffix: 'line-height', propertyName: 'line-height' }],
	},
	'font-family': {
		classes: [{ classSuffix: 'font-family', propertyName: 'font-family' }],
	},
	spacing: {
		classes: [],
		valueFunc: ({ size }: Record<string, unknown>) => String(size ?? ''),
	},
	'border-radius': {
		classes: [],
	},
	dimension: {
		classes: [],
	},
};

export const PRESET_METADATA: PresetMetadataEntry[] =
	THEME_JSON_PRESET_METADATA_BASE.map((entry) => {
		const extra = METADATA_EXTRA_BY_INFIX[entry.cssVarInfix];
		const row: PresetMetadataEntry = {
			path: [...entry.path],
			valueKey: entry.valueKey,
			cssVarInfix: entry.cssVarInfix,
			classes: extra?.classes ?? [],
		};
		if (extra?.valueFunc) {
			row.valueFunc = extra.valueFunc;
		}
		return row;
	});

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
	'typography.lineHeight': 'line-height',
	'typography.fontFamily': 'font-family',
};
