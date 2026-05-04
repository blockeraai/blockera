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
import {
	normalizeVariablePickerSearchQuery,
	useVarPickerPresetContext,
} from '@blockera/controls';

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
import {
	convertRepeaterValueToColors,
	filterMainPaletteColors,
	isShadePaletteColor,
	parsePaletteShadeSlug,
	stripRedundantPaletteShadeBase,
} from './utils';
import { ColorPresetOpener } from './color-preset-opener';
import { ColorPresetPreviewUsageProvider } from './color-preset-preview-context';
import { ColorPresetFields } from './color-preset-fields';
import { ColorShadesRepeaterItem } from './color-shades-repeater-item';
import {
	ColorPaletteVariationsContext,
	type ColorPaletteVariationsContextValue,
} from './color-palette-variations-context';
import type { ColorPresetPreviewUsage } from '../preset-preview/injected-helpers';
import { filterVariationsByBase } from './color-palette-variations-utils';

export type { DefaultColorPresetValue } from './color-palette-variation-types';

export { ColorPresetPreviewUsageProvider } from './color-preset-preview-context';

/**
 * When the repeater payload omits shade rows (e.g. hidden items), carry over shade presets from the
 * previous palette whose parent base is still present. Not used for {@link ColorPaletteVariationsContextValue#setFullPalette},
 * which already passes the authoritative full palette.
 */
function mergeColorPaletteWithKeptShades(
	previousPalette: Color[],
	nextMain: Color[]
): Color[] {
	const slugSet = new Set(nextMain.map((c) => String(c.slug ?? '')));
	const keptShades = previousPalette.filter((c) => {
		if (!isShadePaletteColor(c as Color & Record<string, unknown>)) {
			return false;
		}
		const p = parsePaletteShadeSlug(String(c.slug ?? ''));
		if (p === null || !slugSet.has(p.baseSlug)) {
			return false;
		}
		return !slugSet.has(String(c.slug ?? ''));
	});
	return stripRedundantPaletteShadeBase([...nextMain, ...keptShades]);
}

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
	const pickerCtx = useVarPickerPresetContext();

	const mainColors = useMemo(() => {
		const flattenForColorPickerSearch =
			pickerCtx.active === true &&
			pickerCtx.variableType === 'color' &&
			normalizeVariablePickerSearchQuery(pickerCtx.searchQuery) !== '';
		return colors.map((c) => ({
			...c,
			renderRepeaterItem: flattenForColorPickerSearch
				? true
				: !isShadePaletteColor(c as Color & Record<string, unknown>),
			hasVariations: flattenForColorPickerSearch
				? false
				: filterVariationsByBase(colors, c.slug).length > 0,
		}));
	}, [
		colors,
		pickerCtx.active,
		pickerCtx.searchQuery,
		pickerCtx.variableType,
	]);

	const setFullPalette = useCallback(
		(next: Color[]) => {
			const cleaned = stripRedundantPaletteShadeBase(next);
			if ('theme' === origin) {
				setThemeColors?.(cleaned);
			} else if ('default' === origin) {
				setDefaultColors?.(cleaned);
			} else if ('custom' === origin) {
				setCustomColors?.(cleaned);
			}
		},
		[origin, setThemeColors, setDefaultColors, setCustomColors]
	);

	const onChange = useCallback(
		(newValue: Object) => {
			const nextMain = convertRepeaterValueToColors(newValue);
			const merged = mergeColorPaletteWithKeptShades(colors, nextMain);
			if ('theme' === origin) {
				setThemeColors?.(merged);
			} else if ('default' === origin) {
				setDefaultColors?.(merged);
			} else if ('custom' === origin) {
				setCustomColors?.(merged);
			}
		},
		[colors, origin, setThemeColors, setDefaultColors, setCustomColors]
	);

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('color', 'blockera'));

	const index = useMemo(
		() =>
			getNewIndexFromPresets(
				mainColors.map((c) => ({ slug: c.slug })),
				'custom-'
			),
		[mainColors]
	);

	const defaultPresetValue = useMemo(
		() => ({
			isVisible: true,
			color: '#000000',
			slug: `custom-${index}`,
			renderRepeaterItem: true,
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

	const variationsContextValue = useMemo(
		(): ColorPaletteVariationsContextValue => ({
			origin,
			setFullPalette,
			fullPalette: colors,
		}),
		[origin, colors, setFullPalette]
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
			<ColorPaletteVariationsContext.Provider
				value={variationsContextValue}
			>
				<PresetGroup
					origin={origin}
					variables={mainColors}
					onChange={onChange}
					controlName={controlName}
					title={__('Color', 'blockera')}
					PresetFields={ColorPresetFields}
					repeaterItemHeader={ColorPresetOpener}
					defaultPresetValue={defaultPresetValue}
					label={getOriginVariablesLabel(origin)}
					repeaterItemVariations={
						!pickerCtx.active ? null : ColorShadesRepeaterItem
					}
					presetFieldsPropsResolver={colorPresetFieldsPropsResolver}
				/>
			</ColorPaletteVariationsContext.Provider>
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
		<VStack
			spacing={2}
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
		</VStack>
	);
}

export default ColorPaletteScreen;
