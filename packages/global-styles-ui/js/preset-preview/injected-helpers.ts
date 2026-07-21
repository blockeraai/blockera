/**
 * Preset row → canvas preview is implemented in `@blockera/editor`:
 * - Attribute patches feed the block style engine via PresetCanvasPreviewContext.
 * - Gradient rows use declaration strings injected on the canvas until fully mapped to attributes.
 *
 * The global-styles-ui script may load before editor assets; implementations are registered at runtime
 * via registerGlobalStylesPresetPreviewHelpers.
 *
 * Usage string unions live with their extension consumers (e.g. filter-preset-preview-usage.ts),
 * not in this bridge module.
 */

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
		repeater: object,
		usage?: string
	) => Record<string, unknown>;
	getGlobalStylesTransformPresetPreviewAttributes: (
		repeater: object
	) => Record<string, unknown>;
	getGlobalStylesBorderPresetPreviewAttributes: (
		border: object,
		usage?: string
	) => Record<string, unknown>;
	getGlobalStylesBorderRadiusPresetPreviewAttributes: (
		size: string | number | null | undefined,
		usage?: string
	) => Record<string, unknown>;
	getGlobalStylesSpacingSizePresetPreviewAttributes: (
		size: string | null | undefined,
		usage?: string
	) => Record<string, unknown>;
	getGlobalStylesFontSizePresetPreviewAttributes: (
		size: string | null | undefined
	) => Record<string, unknown>;
	getGlobalStylesColorPresetPreviewAttributes: (
		variable: {
			color?: string;
			type?: string;
		},
		usage?: string
	) => Record<string, unknown>;
	getGlobalStylesColorPresetPreviewDeclarations: (
		variable: {
			color?: string;
			type?: string;
		},
		usage?: string
	) => string;
	getGlobalStylesGradientPresetPreviewDeclarations: (
		gradient: string | null | undefined,
		usage?: string
	) => string;
	getGlobalStylesColorGradientPresetPreviewDeclarations: (
		variable: {
			color?: string;
			type?: string;
		},
		usage?: string
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
	repeater: object,
	usage?: string
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesFilterPresetPreviewAttributes?.(
			repeater,
			usage
		) ?? {}
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
	border: object,
	usage?: string
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesBorderPresetPreviewAttributes?.(
			border,
			usage
		) ?? {}
	);
}

export function getGlobalStylesBorderRadiusPresetPreviewAttributes(
	size: string | number | null | undefined,
	usage?: string
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesBorderRadiusPresetPreviewAttributes?.(
			size,
			usage
		) ?? {}
	);
}

export function getGlobalStylesSpacingSizePresetPreviewAttributes(
	size: string | null | undefined,
	usage?: string
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
	usage?: string
): Record<string, unknown> {
	return (
		injected?.getGlobalStylesColorPresetPreviewAttributes?.(
			variable,
			usage
		) ?? {}
	);
}

export function getGlobalStylesColorPresetPreviewDeclarations(
	variable: {
		color?: string;
		type?: string;
	},
	usage?: string
): string {
	return (
		injected?.getGlobalStylesColorPresetPreviewDeclarations?.(
			variable,
			usage
		) ?? ''
	);
}

export function getGlobalStylesGradientPresetPreviewDeclarations(
	gradient: string | null | undefined,
	usage?: string
): string {
	return (
		injected?.getGlobalStylesGradientPresetPreviewDeclarations?.(
			gradient,
			usage
		) ?? ''
	);
}

export function getGlobalStylesColorGradientPresetPreviewDeclarations(
	variable: {
		color?: string;
		type?: string;
	},
	usage?: string
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
