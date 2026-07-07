/**
 * External dependencies
 */
import {
	__experimentalSpacer as Spacer,
	__experimentalView as View,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import {
	Flex,
	PresetVariablesViewModeProvider,
	PRESET_VARIABLES_SECTION_GAP,
	useVarPickerPresetContext,
} from '@blockera/controls';
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	ScreenHeader,
	shouldShowDefaultPresetGroup,
	shouldShowDefaultPresetGroupInVariablePicker,
	shouldShowThemePresetGroup,
	PresetVariablesScreenToolbar,
	buildVisiblePresetOriginSets,
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

	const pickerCtx = useVarPickerPresetContext();
	const isColorVariablePicker =
		pickerCtx.active === true && pickerCtx.variableType === 'color';

	const defaultLayerOn = !!defaultPaletteEnabled;
	const showDefaultOriginGroup = isColorVariablePicker
		? shouldShowDefaultPresetGroupInVariablePicker(
				defaultLayerOn,
				themeMainCount,
				defaultMainCount
			)
		: shouldShowDefaultPresetGroup(
				defaultLayerOn,
				themeMainCount,
				defaultMainCount
			);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		defaultLayerOn,
		themeMainCount,
		defaultMainCount
	);

	const originSets = useMemo(
		() =>
			buildVisiblePresetOriginSets({
				showThemeOriginGroup,
				showDefaultOriginGroup,
				themeItems: safeThemeColors as Array<
					Color & Record<string, unknown>
				>,
				themeBaseItems: baseTheme as Array<
					Color & Record<string, unknown>
				>,
				defaultItems: safeDefaultColors as Array<
					Color & Record<string, unknown>
				>,
				defaultBaseItems: baseDefault as Array<
					Color & Record<string, unknown>
				>,
				customItems: customColors as Array<
					Color & Record<string, unknown>
				>,
				presetKind: 'color',
			}),
		[
			showThemeOriginGroup,
			showDefaultOriginGroup,
			safeThemeColors,
			baseTheme,
			safeDefaultColors,
			baseDefault,
			customColors,
		]
	);

	return (
		<ColorPresetPreviewUsageProvider value={previewUsage}>
			<PresetVariablesScreenToolbar
				originSets={originSets}
				withSummaryRowPadding
			/>
			<Flex
				direction="column"
				gap={PRESET_VARIABLES_SECTION_GAP}
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
					<PresetVariablesViewModeProvider>
						<ColorPalettePresetContent />
					</PresetVariablesViewModeProvider>
				</Spacer>
			</View>
		</Flex>
	);
}

export default ColorPaletteScreen;
