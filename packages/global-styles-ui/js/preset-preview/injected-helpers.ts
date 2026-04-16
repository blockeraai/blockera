/**
 * Preset row → canvas preview is implemented in `@blockera/editor`:
 * - Attribute patches feed the block style engine via PresetCanvasPreviewContext.
 * - Gradient rows use declaration strings injected on the canvas until fully mapped to attributes.
 *
 * The global-styles-ui script may load before editor assets; implementations are registered at runtime
 * via registerGlobalStylesPresetPreviewHelpers.
 */

/** Matches editor spacing preset preview — spacing token used as width/height/padding/margin/gap. */
export type SpacingSizePresetUsage =
	| 'padding'
	| 'margin'
	| 'gap'
	| 'width'
	| 'height';

/** Font `color` vs `background-color` for color preset row preview. */
export type ColorPresetPreviewUsage = 'color' | 'background';

export type GlobalStylesPresetPreviewHelpers = {
	getGlobalStylesShadowPresetPreviewAttributes: (
		preset: Record<string, unknown>
	) => Record<string, unknown>;
	getGlobalStylesTextShadowPreviewAttributes: (
		css: string
	) => Record<string, unknown>;
	getGlobalStylesTransitionPresetPreviewAttributes: (
		repeater: object
	) => Record<string, unknown>;
	getGlobalStylesFilterPresetPreviewAttributes: (
		repeater: object
	) => Record<string, unknown>;
	getGlobalStylesTransformPresetPreviewAttributes: (
		repeater: object
	) => Record<string, unknown>;
	getGlobalStylesBorderPresetPreviewAttributes: (
		border: object
	) => Record<string, unknown>;
	getGlobalStylesBorderRadiusPresetPreviewAttributes: (
		size: string | number | null | undefined
	) => Record<string, unknown>;
	getGlobalStylesSpacingSizePresetPreviewAttributes: (
		size: string | null | undefined,
		usage?: SpacingSizePresetUsage
	) => Record<string, unknown>;
	getGlobalStylesFontSizePresetPreviewAttributes: (
		size: string | null | undefined
	) => Record<string, unknown>;
	getGlobalStylesColorPresetPreviewAttributes: (
		variable: {
			color?: string;
			type?: string;
		},
		usage?: ColorPresetPreviewUsage
	) => Record<string, unknown>;
	getGlobalStylesGradientPresetPreviewDeclarations: (
		gradient: string | null | undefined
	) => string;
	getGlobalStylesColorGradientPresetPreviewDeclarations: (
		variable: {
			color?: string;
			type?: string;
		},
		usage?: ColorPresetPreviewUsage
	) => string;
};

let injected: GlobalStylesPresetPreviewHelpers | null = null;

/**
 * Called once when `@blockera/editor` loads; wires attribute + canvas declaration implementations.
 */
export function registerGlobalStylesPresetPreviewHelpers(
	helpers: GlobalStylesPresetPreviewHelpers
): void {
	injected = helpers;
}

/** @deprecated Use {@link registerGlobalStylesPresetPreviewHelpers}. */
export function registerPresetPreviewCssHelpers(
	helpers: GlobalStylesPresetPreviewHelpers
): void {
	registerGlobalStylesPresetPreviewHelpers(helpers);
}

export function getGlobalStylesShadowPresetPreviewAttributes(
	preset: Record<string, unknown>
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesShadowPresetPreviewAttributes?.(preset) ?? {}
	);
}

export function getGlobalStylesTextShadowPreviewAttributes(
	css: string
): Record<string, unknown> {
	return injected?.getGlobalStylesTextShadowPreviewAttributes?.(css) ?? {};
}

export function getGlobalStylesTransitionPresetPreviewAttributes(
	repeater: object
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesTransitionPresetPreviewAttributes?.(
			repeater
		) ?? {}
	);
}

export function getGlobalStylesFilterPresetPreviewAttributes(
	repeater: object
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesFilterPresetPreviewAttributes?.(repeater) ?? {}
	);
}

export function getGlobalStylesTransformPresetPreviewAttributes(
	repeater: object
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesTransformPresetPreviewAttributes?.(repeater) ??
		{}
	);
}

export function getGlobalStylesBorderPresetPreviewAttributes(
	border: object
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesBorderPresetPreviewAttributes?.(border) ?? {}
	);
}

export function getGlobalStylesBorderRadiusPresetPreviewAttributes(
	size: string | number | null | undefined
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesBorderRadiusPresetPreviewAttributes?.(size) ??
		{}
	);
}

export function getGlobalStylesSpacingSizePresetPreviewAttributes(
	size: string | null | undefined,
	usage?: SpacingSizePresetUsage
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesSpacingSizePresetPreviewAttributes?.(
			size,
			usage
		) ?? {}
	);
}

export function getGlobalStylesFontSizePresetPreviewAttributes(
	size: string | null | undefined
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesFontSizePresetPreviewAttributes?.(size) ?? {}
	);
}

export function getGlobalStylesColorPresetPreviewAttributes(
	variable: {
		color?: string;
		type?: string;
	},
	usage?: ColorPresetPreviewUsage
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesColorPresetPreviewAttributes?.(
			variable,
			usage
		) ?? {}
	);
}

export function getGlobalStylesGradientPresetPreviewDeclarations(
	gradient: string | null | undefined
): string {
	return (
		injected?.getGlobalStylesGradientPresetPreviewDeclarations?.(
			gradient
		) ?? ''
	);
}

export function getGlobalStylesColorGradientPresetPreviewDeclarations(
	variable: {
		color?: string;
		type?: string;
	},
	usage?: ColorPresetPreviewUsage
): string {
	return (
		injected?.getGlobalStylesColorGradientPresetPreviewDeclarations?.(
			variable,
			usage
		) ?? ''
	);
}

/** @deprecated Use {@link GlobalStylesPresetPreviewHelpers}. */
export type PresetPreviewCssHelpers = GlobalStylesPresetPreviewHelpers;
