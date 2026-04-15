/**
 * Preset row → canvas preview CSS is implemented in `@blockera/editor` (generators + value-addons).
 * The global-styles-ui script loads before editor assets; implementations are registered at runtime
 * via {@link registerPresetPreviewCssHelpers} (called from the editor bootstrap).
 */

/** Matches editor `getGlobalStylesSpacingSizePresetPreviewCss` — spacing token used as width/height/padding/margin/gap. */
export type SpacingSizePresetUsage =
	| 'padding'
	| 'margin'
	| 'gap'
	| 'width'
	| 'height';

/** Font `color` vs `background-color` (or gradient `background`) for color preset row preview. */
export type ColorPresetPreviewUsage = 'color' | 'background';

export type PresetPreviewCssHelpers = {
	getGlobalStylesShadowPresetPreviewCss: (
		preset: Record<string, unknown>
	) => string;
	getGlobalStylesTextShadowCssPreviewCss: (css: string) => string;
	getGlobalStylesTransitionPresetPreviewCss: (repeater: object) => string;
	getGlobalStylesFilterPresetPreviewCss: (repeater: object) => string;
	getGlobalStylesTransformPresetPreviewCss: (repeater: object) => string;
	getGlobalStylesBorderPresetPreviewCss: (border: object) => string;
	getGlobalStylesBorderRadiusPresetPreviewCss: (
		size: string | number | null | undefined
	) => string;
	getGlobalStylesSpacingSizePresetPreviewCss: (
		size: string | null | undefined,
		usage?: SpacingSizePresetUsage
	) => string;
	getGlobalStylesFontSizePresetPreviewCss: (
		size: string | null | undefined
	) => string;
	getGlobalStylesColorPresetPreviewCss: (
		variable: {
			color?: string;
			type?: string;
		},
		usage?: ColorPresetPreviewUsage
	) => string;
	getGlobalStylesGradientPresetPreviewCss: (
		gradient: string | null | undefined
	) => string;
};

let injected: PresetPreviewCssHelpers | null = null;

/**
 * Called once when `@blockera/editor` loads; wires real CSS generator–backed implementations.
 */
export function registerPresetPreviewCssHelpers(
	helpers: PresetPreviewCssHelpers
): void {
	injected = helpers;
}

export function getGlobalStylesShadowPresetPreviewCss(
	preset: Record<string, unknown>
): string {
	return injected?.getGlobalStylesShadowPresetPreviewCss?.(preset) ?? '';
}

export function getGlobalStylesTextShadowCssPreviewCss(css: string): string {
	return injected?.getGlobalStylesTextShadowCssPreviewCss?.(css) ?? '';
}

export function getGlobalStylesTransitionPresetPreviewCss(
	repeater: object
): string {
	return (
		injected?.getGlobalStylesTransitionPresetPreviewCss?.(repeater) ?? ''
	);
}

export function getGlobalStylesFilterPresetPreviewCss(
	repeater: object
): string {
	return injected?.getGlobalStylesFilterPresetPreviewCss?.(repeater) ?? '';
}

export function getGlobalStylesTransformPresetPreviewCss(
	repeater: object
): string {
	return injected?.getGlobalStylesTransformPresetPreviewCss?.(repeater) ?? '';
}

export function getGlobalStylesBorderPresetPreviewCss(border: object): string {
	return injected?.getGlobalStylesBorderPresetPreviewCss?.(border) ?? '';
}

export function getGlobalStylesBorderRadiusPresetPreviewCss(
	size: string | number | null | undefined
): string {
	return injected?.getGlobalStylesBorderRadiusPresetPreviewCss?.(size) ?? '';
}

export function getGlobalStylesSpacingSizePresetPreviewCss(
	size: string | null | undefined,
	usage?: SpacingSizePresetUsage
): string {
	return (
		injected?.getGlobalStylesSpacingSizePresetPreviewCss?.(size, usage) ??
		''
	);
}

export function getGlobalStylesFontSizePresetPreviewCss(
	size: string | null | undefined
): string {
	return injected?.getGlobalStylesFontSizePresetPreviewCss?.(size) ?? '';
}

export function getGlobalStylesColorPresetPreviewCss(
	variable: {
		color?: string;
		type?: string;
	},
	usage?: ColorPresetPreviewUsage
): string {
	return (
		injected?.getGlobalStylesColorPresetPreviewCss?.(variable, usage) ?? ''
	);
}

export function getGlobalStylesGradientPresetPreviewCss(
	gradient: string | null | undefined
): string {
	return injected?.getGlobalStylesGradientPresetPreviewCss?.(gradient) ?? '';
}
