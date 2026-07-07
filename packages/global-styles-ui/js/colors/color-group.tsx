/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { Color } from '@wordpress/global-styles-engine';
import { useCallback, useMemo, memo } from '@wordpress/element';
import type { ElementType } from 'react';

/**
 * Blockera dependencies
 */
import {
	normalizeVariablePickerSearchQuery,
	usePresetVariablesViewMode,
	useVarPickerPresetContext,
	useVariablePickerSearchQuery,
} from '@blockera/controls';

/**
 * Internal dependencies
 */
import {
	PresetGroup,
	getNewIndexFromPresets,
	createPresetFieldsPropsResolver,
	ConfirmResetPresetDialog,
	getOriginResetDialogCopy,
	getOriginVariablesLabel,
	usePresetResetDialogState,
	PresetTaxonomyBridge,
	PresetTaxonomyEditSessionProvider,
	PresetTaxonomyGroupBridge,
	usePresetTaxonomyGroupUi,
} from '../components';
import { PresetVariationsContext } from '../context/preset-variations-context';
import {
	convertRepeaterValueToColors,
	isShadePaletteColor,
	mergeColorPaletteWithKeptShades,
	stripRedundantPaletteShadeBase,
} from './utils';
import { ColorPresetOpener } from './color-preset-opener';
import {
	ColorTaxonomyCategoryClosedPreview,
	taxonomyCategoryHasBaseWithShadeVariations,
} from './color-taxonomy-category-closed-preview';
import { ColorPresetFields } from './color-preset-fields';
import { ColorShadesRepeaterItem } from './color-shades-repeater-item';
import { filterVariationsByBase } from './color-palette-variations-utils';

interface ColorGroupProps {
	label: string;
	origin: string;
	colors: Color[];
	baseColors?: Color[];
	handleResetColors?: () => void;
	setThemeColors?: (colors: Color[]) => void;
	setDefaultColors?: (colors: Color[]) => void;
	setCustomColors?: (colors: Color[]) => void;
}

const colorPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('colorItem');

function ColorGroupInner({
	colors,
	baseColors,
	origin,
	setThemeColors,
	setCustomColors,
	setDefaultColors,
	handleResetColors,
}: ColorGroupProps) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();
	const pickerCtx = useVarPickerPresetContext();
	const variablePickerSearchQuery = useVariablePickerSearchQuery();
	const { viewMode } = usePresetVariablesViewMode();

	const controlName = `color-presets-${origin}`;

	const flattenForColorPickerSearch = useMemo(
		() =>
			pickerCtx.active === true &&
			pickerCtx.variableType === 'color' &&
			normalizeVariablePickerSearchQuery(variablePickerSearchQuery) !==
				'',
		[pickerCtx.active, variablePickerSearchQuery, pickerCtx.variableType]
	);

	const isColorPickerListView = useMemo(
		() =>
			pickerCtx.active === true &&
			pickerCtx.variableType === 'color' &&
			viewMode === 'list' &&
			!flattenForColorPickerSearch,
		[
			pickerCtx.active,
			pickerCtx.variableType,
			viewMode,
			flattenForColorPickerSearch,
		]
	);

	const persistColors = useCallback(
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

	const augmentMainItem = useCallback(
		(
			row: Color & Record<string, unknown>,
			ctx: {
				showTaxonomyUi: boolean;
				taxonomySlugSet: Set<string>;
				simpleSlugSet: Set<string>;
			}
		) => {
			const slug = String(row.slug ?? '');
			const isShadeRow = isShadePaletteColor(row);
			const hasStoredShades =
				filterVariationsByBase(colors, slug).length > 0;
			const baseRepeater = flattenForColorPickerSearch
				? isShadeRow || !hasStoredShades
				: !isShadeRow;
			let renderRepeaterItem =
				typeof row.renderRepeaterItem === 'boolean'
					? row.renderRepeaterItem
					: baseRepeater;
			if (ctx.showTaxonomyUi) {
				if (ctx.taxonomySlugSet.has(slug)) {
					renderRepeaterItem = false;
				} else {
					renderRepeaterItem =
						ctx.simpleSlugSet.has(slug) && baseRepeater;
				}
			}

			// Stored repeater defaults set renderRepeaterItem:true on every row;
			// shade slugs must stay out of the flat list unless search flatten is active.
			if (isShadeRow && !flattenForColorPickerSearch) {
				renderRepeaterItem = false;
			}

			const listViewCompactShades =
				isColorPickerListView && hasStoredShades && !isShadeRow;

			return {
				...row,
				renderRepeaterItem,
				hasVariations: flattenForColorPickerSearch
					? false
					: hasStoredShades,
				...(listViewCompactShades
					? {
							listViewCompactShades: true,
							selectable: false,
						}
					: {}),
			} as Color & Record<string, unknown>;
		},
		[colors, flattenForColorPickerSearch, isColorPickerListView]
	);

	const taxonomy = usePresetTaxonomyGroupUi<Color & Record<string, unknown>>({
		items: colors as Array<Color & Record<string, unknown>>,
		baseItems: baseColors as
			Array<Color & Record<string, unknown>> | undefined,
		origin,
		controlName,
		suppressTaxonomyUi: flattenForColorPickerSearch || viewMode === 'list',
		convertRepeaterToItems: convertRepeaterValueToColors,
		onPersistItems: persistColors,
		augmentMainItem,
		mergeAfterSimpleChange: mergeColorPaletteWithKeptShades,
		mergeAfterTaxonomyChange: mergeColorPaletteWithKeptShades,
	});

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('color', 'blockera'));

	const index = useMemo(
		() =>
			getNewIndexFromPresets(
				taxonomy.mainItems.map((c) => ({ slug: c.slug })),
				'custom-'
			),
		[taxonomy.mainItems]
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
			<PresetVariationsContext.Provider
				value={taxonomy.variationsContextValue}
			>
				<PresetTaxonomyGroupBridge
					taxonomy={taxonomy}
					controlName={controlName}
					origin={origin}
					baselineItems={
						colors as Array<Color & Record<string, unknown>>
					}
					PresetFields={ColorPresetFields}
					repeaterItemHeader={
						ColorPresetOpener as unknown as ElementType
					}
					presetFieldsPropsResolver={colorPresetFieldsPropsResolver}
					renderTaxonomyCategoryClosedPreview={
						renderTaxonomyCategoryClosedPreview
					}
					augmentCategoryShowPreview={
						taxonomyCategoryHasBaseWithShadeVariations
					}
					repeaterItemVariations={
						!pickerCtx.active ? null : ColorShadesRepeaterItem
					}
					PresetTaxonomyBridge={PresetTaxonomyBridge}
				/>
				<PresetGroup
					origin={origin}
					variables={taxonomy.mainItems}
					onChange={taxonomy.onSimpleRepeaterChange}
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
						taxonomy.suppressThemeRepeaterWhenTaxonomyBasePopulated
					}
				/>
			</PresetVariationsContext.Provider>
		</>
	);
}

function ColorGroupComponent(props: ColorGroupProps) {
	return (
		<PresetTaxonomyEditSessionProvider>
			<ColorGroupInner {...props} />
		</PresetTaxonomyEditSessionProvider>
	);
}

const ColorGroup = memo(ColorGroupComponent);

export { ColorGroup, ColorGroupComponent };
