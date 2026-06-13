/**
 * Layout extension spacing preset preview usages (padding, margin, gap).
 * Keep aligned with `layout/preset-preview/spacing-preset-preview-usage.js`.
 */
export const SPACING_PADDING = 'padding' as const;
export const SPACING_MARGIN = 'margin' as const;
export const SPACING_PADDING_TOP = 'padding-top' as const;
export const SPACING_PADDING_RIGHT = 'padding-right' as const;
export const SPACING_PADDING_BOTTOM = 'padding-bottom' as const;
export const SPACING_PADDING_LEFT = 'padding-left' as const;
export const SPACING_PADDING_TOP_BOTTOM = 'padding-top-bottom' as const;
export const SPACING_PADDING_LEFT_RIGHT = 'padding-left-right' as const;
export const SPACING_MARGIN_TOP = 'margin-top' as const;
export const SPACING_MARGIN_RIGHT = 'margin-right' as const;
export const SPACING_MARGIN_BOTTOM = 'margin-bottom' as const;
export const SPACING_MARGIN_LEFT = 'margin-left' as const;
export const SPACING_MARGIN_TOP_BOTTOM = 'margin-top-bottom' as const;
export const SPACING_MARGIN_LEFT_RIGHT = 'margin-left-right' as const;
export const SPACING_GAP = 'gap' as const;
export const SPACING_GAP_ROWS = 'gap-rows' as const;
export const SPACING_GAP_COLUMNS = 'gap-columns' as const;

/**
 * Size extension spacing preset preview usages (width / height dimensions).
 * Keep aligned with `size/preset-preview/spacing-preset-preview-usage.js`.
 */
export const SPACING_WIDTH = 'width' as const;
export const SPACING_MIN_WIDTH = 'min-width' as const;
export const SPACING_MAX_WIDTH = 'max-width' as const;
export const SPACING_HEIGHT = 'height' as const;
export const SPACING_MIN_HEIGHT = 'min-height' as const;
export const SPACING_MAX_HEIGHT = 'max-height' as const;

export type SpacingSizePresetUsage =
	| typeof SPACING_PADDING
	| typeof SPACING_MARGIN
	| typeof SPACING_PADDING_TOP
	| typeof SPACING_PADDING_RIGHT
	| typeof SPACING_PADDING_BOTTOM
	| typeof SPACING_PADDING_LEFT
	| typeof SPACING_PADDING_TOP_BOTTOM
	| typeof SPACING_PADDING_LEFT_RIGHT
	| typeof SPACING_MARGIN_TOP
	| typeof SPACING_MARGIN_RIGHT
	| typeof SPACING_MARGIN_BOTTOM
	| typeof SPACING_MARGIN_LEFT
	| typeof SPACING_MARGIN_TOP_BOTTOM
	| typeof SPACING_MARGIN_LEFT_RIGHT
	| typeof SPACING_GAP
	| typeof SPACING_GAP_ROWS
	| typeof SPACING_GAP_COLUMNS
	| typeof SPACING_WIDTH
	| typeof SPACING_MIN_WIDTH
	| typeof SPACING_MAX_WIDTH
	| typeof SPACING_HEIGHT
	| typeof SPACING_MIN_HEIGHT
	| typeof SPACING_MAX_HEIGHT;

export const SPACING_PRESET_PREVIEW_USAGES = new Set<SpacingSizePresetUsage>([
	SPACING_PADDING,
	SPACING_MARGIN,
	SPACING_PADDING_TOP,
	SPACING_PADDING_RIGHT,
	SPACING_PADDING_BOTTOM,
	SPACING_PADDING_LEFT,
	SPACING_PADDING_TOP_BOTTOM,
	SPACING_PADDING_LEFT_RIGHT,
	SPACING_MARGIN_TOP,
	SPACING_MARGIN_RIGHT,
	SPACING_MARGIN_BOTTOM,
	SPACING_MARGIN_LEFT,
	SPACING_MARGIN_TOP_BOTTOM,
	SPACING_MARGIN_LEFT_RIGHT,
	SPACING_GAP,
	SPACING_GAP_ROWS,
	SPACING_GAP_COLUMNS,
	SPACING_WIDTH,
	SPACING_MIN_WIDTH,
	SPACING_MAX_WIDTH,
	SPACING_HEIGHT,
	SPACING_MIN_HEIGHT,
	SPACING_MAX_HEIGHT,
]);

export const DEFAULT_SPACING_PRESET_PREVIEW_USAGE = SPACING_PADDING;
