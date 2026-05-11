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
import type { ElementType } from 'react';

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
	PresetTaxonomyBridge,
	buildTaxonomyTree,
	mergeSimpleRepeaterIntoFullPalette,
	partitionPresetsForTaxonomyUi,
	usePresetTaxonomyDeclarations,
} from '../components';
import { useGetColors } from './use-get-colors';
import {
	convertRepeaterValueToColors,
	filterMainPaletteColors,
	isShadePaletteColor,
	mergeColorPaletteWithKeptShades,
	stripRedundantPaletteShadeBase,
} from './utils';
import { ColorPresetOpener } from './color-preset-opener';
import {
	ColorTaxonomyCategoryClosedPreview,
	taxonomyCategoryHasBaseWithShadeVariations,
} from './color-taxonomy-category-closed-preview';
import { ColorPresetPreviewUsageProvider } from './color-preset-preview-context';
import { ColorPresetFields } from './color-preset-fields';
import { ColorShadesRepeaterItem } from './color-shades-repeater-item';
import {
	PresetVariationsContext,
	type PresetVariationsContextValue,
} from '../context/preset-variations-context';
import type { ColorPresetPreviewUsage } from '../preset-preview/injected-helpers';
import { filterVariationsByBase } from './color-palette-variations-utils';

export type { DefaultColorPresetValue } from './color-palette-variation-types';

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

	const controlName = `color-presets-${origin}`;

	const taxonomyDeclarations = usePresetTaxonomyDeclarations('color');

	const flattenForColorPickerSearch = useMemo(
		() =>
			pickerCtx.active === true &&
			pickerCtx.variableType === 'color' &&
			normalizeVariablePickerSearchQuery(pickerCtx.searchQuery) !== '',
		[pickerCtx.active, pickerCtx.searchQuery, pickerCtx.variableType]
	);

	const partition = useMemo(
		() =>
			partitionPresetsForTaxonomyUi(
				colors as Array<Color & Record<string, unknown>>,
				taxonomyDeclarations
			),
		[colors, taxonomyDeclarations]
	);

	const showTaxonomyUi =
		origin === 'theme' &&
		!flattenForColorPickerSearch &&
		taxonomyDeclarations.groups.length > 0 &&
		partition.taxonomyPresets.length > 0;

	const simpleSlugSet = useMemo(
		() => new Set(partition.simplePresets.map((p) => String(p.slug ?? ''))),
		[partition.simplePresets]
	);

	const mainColors = useMemo(() => {
		return colors.map((c) => {
			const slug = String(c.slug ?? '');
			const baseRepeater = flattenForColorPickerSearch
				? true
				: !isShadePaletteColor(c as Color & Record<string, unknown>);
			let renderRepeaterItem = baseRepeater;
			if (showTaxonomyUi) {
				if (partition.taxonomySlugSet.has(slug)) {
					renderRepeaterItem = false;
				} else {
					renderRepeaterItem =
						simpleSlugSet.has(slug) && baseRepeater;
				}
			}
			return {
				...c,
				renderRepeaterItem,
				hasVariations: flattenForColorPickerSearch
					? false
					: filterVariationsByBase(colors, c.slug).length > 0,
			};
		});
	}, [
		colors,
		flattenForColorPickerSearch,
		partition.taxonomySlugSet,
		showTaxonomyUi,
		simpleSlugSet,
	]);

	const taxonomyTree = useMemo(
		() =>
			buildTaxonomyTree(
				partition.taxonomyPresets,
				taxonomyDeclarations,
				mainColors
			),
		[partition.taxonomyPresets, taxonomyDeclarations, mainColors]
	);

	const taxonomyBridgeMainColors = useMemo(() => {
		if (!showTaxonomyUi) {
			return [];
		}
		return mainColors;
	}, [mainColors, partition.taxonomySlugSet, showTaxonomyUi]);

	const taxonomyRepeaterDefaults = useMemo(
		() => ({
			isVisible: true,
			renderRepeaterItem: true,
			deletable: false,
			cloneable: false,
			visibilitySupport: false,
		}),
		[]
	);

	const setFullPalette = useCallback(
		(next: Color[]) => {
			const cleaned = stripRedundantPaletteShadeBase(next);
			if (isEquals(cleaned, colors)) {
				return;
			}
			if ('theme' === origin) {
				setThemeColors?.(cleaned);
			} else if ('default' === origin) {
				setDefaultColors?.(cleaned);
			} else if ('custom' === origin) {
				setCustomColors?.(cleaned);
			}
		},
		[origin, colors, setThemeColors, setDefaultColors, setCustomColors]
	);

	const onChange = useCallback(
		(newValue: Object) => {
			const nextMain = convertRepeaterValueToColors(newValue, colors);
			const mergedFlat = showTaxonomyUi
				? mergeSimpleRepeaterIntoFullPalette(
						colors,
						nextMain,
						partition.taxonomySlugSet
					)
				: nextMain;
			const merged = mergeColorPaletteWithKeptShades(colors, mergedFlat);
			if (isEquals(merged, colors)) {
				return;
			}
			if ('theme' === origin) {
				setThemeColors?.(merged);
			} else if ('default' === origin) {
				setDefaultColors?.(merged);
			} else if ('custom' === origin) {
				setCustomColors?.(merged);
			}
		},
		[
			colors,
			origin,
			partition.taxonomySlugSet,
			setThemeColors,
			setDefaultColors,
			setCustomColors,
			showTaxonomyUi,
		]
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

	const mergeTaxonomyRepeaterIntoPersisted = useCallback(
		(
			payload: object,
			baselineItems: Array<Color & Record<string, unknown>>
		) => {
			const baseline = baselineItems as Color[];
			const nextTaxonomy = convertRepeaterValueToColors(
				payload,
				baseline
			);
			const bySlug = new Map(
				nextTaxonomy.map((r) => [String(r.slug ?? ''), r])
			);
			const mergedFull = baseline.map((row) => {
				const slug = String(row.slug ?? '');
				const rep = bySlug.get(slug);
				return (rep ?? row) as Color;
			});
			return mergeColorPaletteWithKeptShades(
				baseline,
				mergedFull
			) as Array<Color & Record<string, unknown>>;
		},
		[]
	);

	const renderTaxonomyCategoryClosedPreview = useCallback(
		(presets: Array<Color & Record<string, unknown>>) => (
			<ColorTaxonomyCategoryClosedPreview presets={presets} />
		),
		[]
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

	const variationsContextValue = useMemo(
		(): PresetVariationsContextValue<unknown> => ({
			origin,
			setFullItems: (next) => setFullPalette(next as Color[]),
			fullItems: colors,
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
			<PresetVariationsContext.Provider value={variationsContextValue}>
				{showTaxonomyUi && taxonomyTree.length > 0 ? (
					<PresetTaxonomyBridge<Color & Record<string, unknown>>
						controlName={controlName}
						mainRepeaterValue={
							taxonomyBridgeMainColors as Array<
								Color & Record<string, unknown>
							>
						}
						baselineItems={
							colors as Array<Color & Record<string, unknown>>
						}
						mergeRepeaterPayloadIntoPersisted={
							mergeTaxonomyRepeaterIntoPersisted
						}
						onPersistItems={setFullPalette}
						tree={taxonomyTree}
						origin={origin}
						defaultRepeaterItemShape={taxonomyRepeaterDefaults}
						PresetFields={ColorPresetFields}
						repeaterItemHeader={
							ColorPresetOpener as unknown as ElementType
						}
						presetFieldsPropsResolver={
							colorPresetFieldsPropsResolver
						}
						renderTaxonomyCategoryClosedPreview={
							renderTaxonomyCategoryClosedPreview
						}
						augmentCategoryShowPreview={
							taxonomyCategoryHasBaseWithShadeVariations
						}
						repeaterItemVariations={
							!pickerCtx.active ? null : ColorShadesRepeaterItem
						}
					/>
				) : null}
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
					suppressThemeRepeaterWhenTaxonomyBasePopulated={
						showTaxonomyUi &&
						taxonomyTree.length > 0 &&
						partition.simplePresets.length === 0
					}
				/>
			</PresetVariationsContext.Provider>
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
