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
	const [themeColors, setThemeColors] = useGlobalSetting<Color[] | undefined>(
		'color.palette.theme'
	);
	const [baseThemeColors] = useGlobalSetting<Color[] | undefined>(
		'color.palette.theme',
		'',
		'base'
	);
	const [defaultColors, setDefaultColors] = useGlobalSetting<
		Color[] | undefined
	>('color.palette.default');
	const [baseDefaultColors] = useGlobalSetting<Color[] | undefined>(
		'color.palette.default',
		'',
		'base'
	);
	const [customColors = [], setCustomColors] = useGlobalSetting<
		Color[] | undefined
	>('color.palette.custom');
	const [defaultPaletteEnabled = true] = useGlobalSetting<boolean>(
		'color.defaultPalette'
	);

	const safeThemeColors = useMemo(() => themeColors || [], [themeColors]);
	const safeCustomColors = useMemo(() => customColors || [], [customColors]);
	const safeDefaultColors = useMemo(
		() => defaultColors || [],
		[defaultColors]
	);
	const safeDefaultPaletteEnabled = useMemo(
		() => defaultPaletteEnabled ?? true,
		[defaultPaletteEnabled]
	);

	const colors = useMemo(
		() =>
			[
				...safeCustomColors,
				...safeThemeColors,
				...(safeDefaultColors && safeDefaultPaletteEnabled
					? safeDefaultColors
					: []),
			].map((color) => color.color),
		[
			safeThemeColors,
			safeCustomColors,
			safeDefaultColors,
			safeDefaultPaletteEnabled,
		]
	);

	return {
		colors,
		themeColors,
		customColors,
		defaultColors,
		setThemeColors,
		setCustomColors,
		baseThemeColors,
		setDefaultColors,
		baseDefaultColors,
		defaultPaletteEnabled,
	};
};
