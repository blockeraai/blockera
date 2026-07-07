/**
 * Color preset canvas preview usages — keep aligned with extension consumers:
 * - Typography → {@link FONT_COLOR_PRESET_PREVIEW_USAGE} (`blockeraFontColor`)
 * - Background → {@link BACKGROUND_COLOR_PRESET_PREVIEW_USAGE} (`blockeraBackgroundColor`)
 * - Border → {@link BORDER_COLOR_PRESET_PREVIEW_USAGE} (`blockeraBorder` color field)
 */
export const FONT_COLOR_PRESET_PREVIEW_USAGE = 'color' as const;
export const BACKGROUND_COLOR_PRESET_PREVIEW_USAGE = 'background' as const;
export const BORDER_COLOR_PRESET_PREVIEW_USAGE = 'border-color' as const;

export type ColorPresetPreviewUsage =
	| typeof FONT_COLOR_PRESET_PREVIEW_USAGE
	| typeof BACKGROUND_COLOR_PRESET_PREVIEW_USAGE
	| typeof BORDER_COLOR_PRESET_PREVIEW_USAGE;

export const COLOR_PRESET_PREVIEW_USAGES = new Set<ColorPresetPreviewUsage>([
	FONT_COLOR_PRESET_PREVIEW_USAGE,
	BACKGROUND_COLOR_PRESET_PREVIEW_USAGE,
	BORDER_COLOR_PRESET_PREVIEW_USAGE,
]);

export const DEFAULT_COLOR_PRESET_PREVIEW_USAGE =
	BACKGROUND_COLOR_PRESET_PREVIEW_USAGE;
