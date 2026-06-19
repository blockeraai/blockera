/**
 * External dependencies
 */
import {
	__experimentalSpacer as Spacer,
	__experimentalView as View,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	ScreenHeader,
	shouldShowDefaultPresetGroup,
	shouldShowThemePresetGroup,
} from '../components';
import { useGetColors } from './use-get-colors';
import { filterMainPaletteColors } from './utils';
import { ColorPresetPreviewUsageProvider } from './color-preset-preview-context';
import type { ColorPresetPreviewUsage } from './color-preset-preview-usage';
import { ColorGroup } from './color-group';

export type { DefaultColorPresetValue } from './color-palette-variation-types';

export { ColorPresetPreviewUsageProvider } from './color-preset-preview-context';

interface ColorPaletteScreenProps {
	onBackHandler: () => void;
}

export function ColorPalettePresetContent({
	previewUsage,
}: {
	/** When the palette editor is embedded, sets row hover preview (font `color` vs `background-color`). */
	previewUsage?: ColorPresetPreviewUsage;
} = {}) {
	const {
		themeColors,
		customColors,
		defaultColors,
		setThemeColors,
		baseThemeColors,
		setCustomColors,
		setDefaultColors,
		baseDefaultColors,
		defaultPaletteEnabled,
	} = useGetColors();

	const baseTheme = useMemo(() => baseThemeColors ?? [], [baseThemeColors]);
	const safeThemeColors = useMemo(() => themeColors ?? [], [themeColors]);
	const baseDefault = useMemo(
		() => baseDefaultColors ?? [],
		[baseDefaultColors]
	);
	const safeDefaultColors = useMemo(
		() => defaultColors ?? [],
		[defaultColors]
	);

	const themeMainCount = useMemo(
		() => filterMainPaletteColors(safeThemeColors).length,
		[safeThemeColors]
	);
	const defaultMainCount = useMemo(
		() => filterMainPaletteColors(safeDefaultColors).length,
		[safeDefaultColors]
	);

	const resetThemeToBase = useCallback(() => {
		setThemeColors(baseTheme);
	}, [setThemeColors, baseTheme]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultColors(baseDefault);
	}, [setDefaultColors, baseDefault]);

	const clearCustomColors = useCallback(() => {
		setCustomColors([]);
	}, [setCustomColors]);

	const themeResetHandler = useMemo(() => {
		if (!isEquals(safeThemeColors, baseTheme)) {
			return resetThemeToBase;
		}
		return undefined;
	}, [safeThemeColors, baseTheme, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!isEquals(safeDefaultColors, baseDefault)) {
			return resetDefaultToBase;
		}
		return undefined;
	}, [safeDefaultColors, baseDefault, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customColors.length > 0 ? clearCustomColors : undefined),
		[customColors.length, clearCustomColors]
	);

	const defaultLayerOn = !!defaultPaletteEnabled;
	const showDefaultOriginGroup = shouldShowDefaultPresetGroup(
		defaultLayerOn,
		themeMainCount,
		defaultMainCount
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		defaultLayerOn,
		themeMainCount,
		defaultMainCount
	);

	return (
		<ColorPresetPreviewUsageProvider value={previewUsage}>
			<Flex
				direction="column"
				gap={20}
				className="global-styles-ui-color-palette-panel"
			>
				{showThemeOriginGroup && (
					<ColorGroup
						origin="theme"
						label={__('Theme', 'blockera')}
						colors={safeThemeColors}
						baseColors={baseTheme}
						setThemeColors={setThemeColors}
						handleResetColors={themeResetHandler}
					/>
				)}

				{showDefaultOriginGroup && (
					<ColorGroup
						origin="default"
						label={__('Default', 'blockera')}
						colors={safeDefaultColors}
						setDefaultColors={setDefaultColors}
						handleResetColors={defaultResetHandler}
					/>
				)}

				<ColorGroup
					origin="custom"
					label={__('Custom', 'blockera')}
					colors={customColors}
					setCustomColors={setCustomColors}
					handleResetColors={customResetHandler}
				/>
			</Flex>
		</ColorPresetPreviewUsageProvider>
	);
}

function ColorPaletteScreen({ onBackHandler }: ColorPaletteScreenProps) {
	return (
		<Flex
			direction="column"
			gap={0}
			className="blockera-color-palette-presets"
			style={{ paddingBottom: '10px' }}
		>
			<ScreenHeader
				onBack={onBackHandler}
				dataTest="global-styles-color-palette-screen"
				title={__('Color Variables', 'blockera')}
				description={__(
					'Create and edit color variables used for text, backgrounds, and borders.',
					'blockera'
				)}
			/>

			<View>
				<Spacer paddingX={4}>
					<ColorPalettePresetContent />
				</Spacer>
			</View>
		</Flex>
	);
}

export default ColorPaletteScreen;
