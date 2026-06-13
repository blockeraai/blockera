/**
 * Gradient preset canvas preview usages — keep aligned with extension consumers:
 * - Typography font gradient → {@link FONT_GRADIENT_PRESET_PREVIEW_USAGE}
 * - Background gradient → {@link BACKGROUND_GRADIENT_PRESET_PREVIEW_USAGE}
 */
export const FONT_GRADIENT_PRESET_PREVIEW_USAGE = 'color' as const;
export const BACKGROUND_GRADIENT_PRESET_PREVIEW_USAGE = 'background' as const;

export type GradientPresetPreviewUsage =
	| typeof FONT_GRADIENT_PRESET_PREVIEW_USAGE
	| typeof BACKGROUND_GRADIENT_PRESET_PREVIEW_USAGE;

export const GRADIENT_PRESET_PREVIEW_USAGES =
	new Set<GradientPresetPreviewUsage>([
		FONT_GRADIENT_PRESET_PREVIEW_USAGE,
		BACKGROUND_GRADIENT_PRESET_PREVIEW_USAGE,
	]);

export const DEFAULT_GRADIENT_PRESET_PREVIEW_USAGE =
	BACKGROUND_GRADIENT_PRESET_PREVIEW_USAGE;
