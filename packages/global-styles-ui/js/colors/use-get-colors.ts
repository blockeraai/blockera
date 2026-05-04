/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { useGlobalSetting } from '../context/global-style-hooks';

export interface UseGetColorsParams {
	colors: string[];
	defaultPaletteEnabled: boolean;
	themeColors: Color[] | undefined;
	defaultColors: Color[] | undefined;
	customColors: Color[] | undefined;
	baseThemeColors: Color[] | undefined;
	baseDefaultColors: Color[] | undefined;
	setThemeColors: (colors: Color[]) => void;
	setCustomColors: (colors: Color[]) => void;
	setDefaultColors: (colors: Color[]) => void;
}

export const useGetColors = (): UseGetColorsParams => {
	const [themeColors, setThemeColors] = useGlobalSetting(
		'color.palette.theme',
		''
	);
	const [baseThemeColors] = useGlobalSetting(
		'color.palette.theme',
		'',
		'base'
	);
	const [defaultColors, setDefaultColors] = useGlobalSetting(
		'color.palette.default',
		''
	);
	const [baseDefaultColors] = useGlobalSetting(
		'color.palette.default',
		'',
		'base'
	);
	const [customColorsUntyped, setCustomColors] = useGlobalSetting(
		'color.palette.custom',
		''
	);
	const [defaultPaletteEnabled] = useGlobalSetting(
		'color.defaultPalette',
		''
	);

	const safeThemeColors = useMemo(
		() => (Array.isArray(themeColors) ? themeColors : []) as Color[],
		[themeColors]
	);
	const customColors = useMemo(
		() =>
			(Array.isArray(customColorsUntyped)
				? customColorsUntyped
				: []) as Color[],
		[customColorsUntyped]
	);
	const safeDefaultColors = useMemo(
		() => (Array.isArray(defaultColors) ? defaultColors : []) as Color[],
		[defaultColors]
	);
	const safeDefaultPaletteEnabled = useMemo(
		() =>
			typeof defaultPaletteEnabled === 'boolean'
				? defaultPaletteEnabled
				: true,
		[defaultPaletteEnabled]
	);

	const colors = useMemo(
		() =>
			[
				...customColors,
				...safeThemeColors,
				...(safeDefaultColors.length && safeDefaultPaletteEnabled
					? safeDefaultColors
					: []),
			].map((color) => color.color),
		[
			safeThemeColors,
			customColors,
			safeDefaultColors,
			safeDefaultPaletteEnabled,
		]
	);

	return {
		colors,
		themeColors: themeColors as Color[] | undefined,
		customColors,
		defaultColors: defaultColors as Color[] | undefined,
		setThemeColors: (rows) => setThemeColors(rows),
		setCustomColors: (rows) => setCustomColors(rows),
		baseThemeColors: baseThemeColors as Color[] | undefined,
		setDefaultColors: (rows) => setDefaultColors(rows),
		baseDefaultColors: baseDefaultColors as Color[] | undefined,
		defaultPaletteEnabled: safeDefaultPaletteEnabled,
	};
};
