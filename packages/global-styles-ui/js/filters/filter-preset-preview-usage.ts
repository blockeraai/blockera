/**
 * Filter preset canvas preview usages — keep aligned with Effects extension consumers:
 * - {@link FILTER_PRESET_PREVIEW_USAGE} → `Filter` (`blockeraFilter`)
 * - {@link BACKDROP_FILTER_PRESET_PREVIEW_USAGE} → `BackdropFilter` (`blockeraBackdropFilter`)
 */
export const FILTER_PRESET_PREVIEW_USAGE = 'filter' as const;
export const BACKDROP_FILTER_PRESET_PREVIEW_USAGE = 'backdrop-filter' as const;

export type FilterPresetPreviewUsage =
	| typeof FILTER_PRESET_PREVIEW_USAGE
	| typeof BACKDROP_FILTER_PRESET_PREVIEW_USAGE;

export const FILTER_PRESET_PREVIEW_USAGES = new Set<FilterPresetPreviewUsage>([
	FILTER_PRESET_PREVIEW_USAGE,
	BACKDROP_FILTER_PRESET_PREVIEW_USAGE,
]);

export const DEFAULT_FILTER_PRESET_PREVIEW_USAGE = FILTER_PRESET_PREVIEW_USAGE;
