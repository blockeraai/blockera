/**
 * External dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalSpacer as Spacer,
	__experimentalView as View,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import type { Color } from '@wordpress/global-styles-engine';
import { useCallback, useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	PresetGroup,
	ScreenHeader,
	getNewIndexFromPresets,
	createPresetFieldsPropsResolver,
	ConfirmResetPresetDialog,
	getOriginResetDialogCopy,
	getOriginVariablesLabel,
	shouldShowDefaultPresetGroup,
	shouldShowThemePresetGroup,
	usePresetResetDialogState,
} from '../components';
import { useGetColors } from './use-get-colors';
import { convertRepeaterValueToColors } from './utils';
import { ColorPresetOpener } from './color-preset-opener';
import { ColorPresetPreviewUsageProvider } from './color-preset-preview-context';
import { ColorPresetFields } from './color-preset-fields';
import type { ColorPresetPreviewUsage } from '../preset-preview/injected-helpers';

export { ColorPresetPreviewUsageProvider } from './color-preset-preview-context';

interface ColorPaletteScreenProps {
	onBackHandler: () => void;
}

interface ColorGroupProps {
	label: string;
	origin: string;
	colors: Color[];
	handleResetColors?: () => void;
	setThemeColors?: (colors: Color[]) => void;
	setDefaultColors?: (colors: Color[]) => void;
	setCustomColors?: (colors: Color[]) => void;
}

export type DefaultColorPresetValue = {
	slug: string;
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
	color: string;
	type?: string;
};

const colorPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('colorItem');

function ColorGroupComponent({
	colors,
	origin,
	setThemeColors,
	setCustomColors,
	setDefaultColors,
	handleResetColors,
}: ColorGroupProps) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

	const convertAndSetThemeColors = useCallback(
		(newValue: Object) =>
			setThemeColors(convertRepeaterValueToColors(newValue)),
		[setThemeColors]
	);

	const convertAndSetDefaultColors = useCallback(
		(newValue: Object) =>
			setDefaultColors(convertRepeaterValueToColors(newValue)),
		[setDefaultColors]
	);

	const convertAndSetCustomColors = useCallback(
		(newValue: Object) =>
			setCustomColors(convertRepeaterValueToColors(newValue)),
		[setCustomColors]
	);

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('color', 'blockera'));

	const index = useMemo(
		() =>
			getNewIndexFromPresets(
				colors.map((c) => ({ slug: c.slug })),
				'custom-'
			),
		[colors]
	);

	const defaultPresetValue = useMemo(
		() => ({
			isVisible: true,
			color: '#000000',
			slug: `custom-${index}`,
			deletable: origin === 'custom',
			cloneable: origin === 'custom',
			visibilitySupport: origin === 'custom',
			name: sprintf(
				/* translators: %d: color index */
				__('Color %d', 'blockera'),
				index
			) as string,
		}),
		[index, origin]
	);

	const controlName = `color-presets-${origin}`;

	const onChange = useCallback(
		(newValue: Object) => {
			if ('theme' === origin) {
				convertAndSetThemeColors(newValue);
			} else if ('default' === origin) {
				convertAndSetDefaultColors(newValue);
			} else if ('custom' === origin) {
				convertAndSetCustomColors(newValue);
			}
		},
		[
			origin,
			convertAndSetThemeColors,
			convertAndSetDefaultColors,
			convertAndSetCustomColors,
		]
	);

	return (
		<>
			{handleResetColors && isResetDialogOpen && (
				<ConfirmResetPresetDialog
					text={resetDialogText}
					confirmButtonText={confirmButtonText}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetColors}
				/>
			)}
			<PresetGroup
				repeaterItemHeader={ColorPresetOpener}
				onChange={onChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={colors}
				PresetFields={ColorPresetFields}
				title={__('Color', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				presetFieldsPropsResolver={colorPresetFieldsPropsResolver}
			/>
		</>
	);
}

const ColorGroup = memo(ColorGroupComponent);

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
		safeThemeColors.length,
		safeDefaultColors.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		defaultLayerOn,
		safeThemeColors.length,
		safeDefaultColors.length
	);

	return (
		<ColorPresetPreviewUsageProvider value={previewUsage}>
			<VStack
				spacing={8}
				className="global-styles-ui-color-palette-panel"
			>
				{showThemeOriginGroup && (
					<ColorGroup
						origin="theme"
						label={__('Theme', 'blockera')}
						colors={safeThemeColors}
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
			</VStack>
		</ColorPresetPreviewUsageProvider>
	);
}

function ColorPaletteScreen({ onBackHandler }: ColorPaletteScreenProps) {
	return (
		<VStack spacing={2} className="blockera-color-palette-presets">
			<ScreenHeader
				onBack={onBackHandler}
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
		</VStack>
	);
}

export default ColorPaletteScreen;
