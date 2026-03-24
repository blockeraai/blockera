/**
 * External dependencies
 */
import type { Color, Gradient } from '@wordpress/global-styles-engine';

/**
 * Navigation screen props - shared pattern for colors and gradients
 */
export interface ColorsScreenProps {
	colors: Color[];
	linearGradients?: Gradient[];
	radialGradients?: Gradient[];
	onClick: (event: Event) => void;
}

/**
 * Screen header handler props - used for back navigation
 */
export interface OnBackHandlerProps {
	onBackHandler: () => void;
}

/**
 * Color palette screen props - from useGetColors
 */
export interface ColorPaletteScreenProps extends OnBackHandlerProps {
	themeColors: Color[] | undefined;
	setThemeColors: (colors: Color[]) => void;
	baseThemeColors: Color[] | undefined;
	defaultColors: Color[] | undefined;
	setDefaultColors: (colors: Color[]) => void;
	baseDefaultColors: Color[] | undefined;
	customColors: Color[];
	setCustomColors: (colors: Color[]) => void;
	defaultPaletteEnabled: boolean;
}

/**
 * Linear gradients screen props - from useGetLinearGradients
 */
export interface LinearGradientsScreenProps extends OnBackHandlerProps {
	themeGradients: Gradient[] | undefined;
	setThemeGradients: (gradients: Gradient[]) => void;
	baseThemeGradients: Gradient[] | undefined;
	defaultGradients: Gradient[] | undefined;
	setDefaultGradients: (gradients: Gradient[]) => void;
	baseDefaultGradients: Gradient[] | undefined;
	customGradients: Gradient[];
	setCustomGradients: (gradients: Gradient[]) => void;
	defaultGradientsEnabled: boolean;
}

/**
 * Radial gradients screen props - from useGetRadialGradients
 */
export interface RadialGradientsScreenProps extends OnBackHandlerProps {
	themeGradients: Gradient[] | undefined;
	setThemeGradients: (gradients: Gradient[]) => void;
	baseThemeGradients: Gradient[] | undefined;
	defaultGradients: Gradient[] | undefined;
	setDefaultGradients: (gradients: Gradient[]) => void;
	baseDefaultGradients: Gradient[] | undefined;
	customGradients: Gradient[];
	setCustomGradients: (gradients: Gradient[]) => void;
	defaultGradientsEnabled: boolean;
}
