/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	PresetVariablesViewModeProvider,
	PRESET_VARIABLES_SECTION_GAP,
} from '@blockera/controls';
import { isEquals } from '@blockera/utils';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	getNewIndexFromPresets,
	createPresetFieldsPropsResolver,
	getOriginResetDialogCopy,
	getOriginVariablesLabel,
	GlobalStylesPanelDescription,
	shouldShowDefaultPresetGroup,
	shouldShowThemePresetGroup,
	PresetTaxonomyGroupLayout,
	PresetVariablesScreenToolbar,
	buildVisiblePresetOriginSets,
} from '../components';
import { useGlobalSetting } from '../context/global-style-hooks';
import { BLOCKERA_GLOBAL_SETTING_PATH } from '@blockera/data';
import { type VariableType } from '../components/types';
import { FilterPresetOpener } from './filter-preset-opener';
import {
	FilterPresetSize,
	type FilterDefaultPresetValue,
} from './filter-preset-size';
import { sanitizeFilterPresets, type WpFilterPreset } from './utils';
import { NavItemBackButton } from '../navigation/nav-item-back-button';

const filterPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('filterPreset');

function FilterPresetGroupComponent({
	sizes,
	baseSizes,
	origin,
	persistSizes,
	convertRepeaterToItems,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: WpFilterPreset[];
	baseSizes?: WpFilterPreset[];
	persistSizes?: (items: WpFilterPreset[]) => void;
	convertRepeaterToItems: (
		newValue: object,
		baseline: WpFilterPreset[]
	) => WpFilterPreset[];
	handleResetPresets?: () => void;
}) {
	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('filter', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'filter-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): FilterDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			isVisible: true,
			items: [
				{
					isVisible: true,
					type: 'blur',
					blur: '3px',
				},
			],
			slug: `filter-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: filter preset index */
			name: sprintf(__('Filter %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `filter-preset-presets-${origin}`;

	const onPersistItems = useCallback(
		(next: WpFilterPreset[]) => {
			persistSizes?.(next);
		},
		[persistSizes]
	);

	return (
		<PresetTaxonomyGroupLayout<WpFilterPreset & Record<string, unknown>>
			origin={origin}
			items={sizes}
			baseItems={baseSizes}
			controlName={controlName}
			convertRepeaterToItems={convertRepeaterToItems}
			onPersistItems={onPersistItems}
			PresetFields={FilterPresetSize}
			repeaterItemHeader={FilterPresetOpener}
			presetFieldsPropsResolver={filterPresetFieldsPropsResolver}
			defaultPresetValue={defaultPresetValue}
			title={__('Filters', 'blockera')}
			label={getOriginVariablesLabel(origin)}
			handleReset={handleResetPresets}
			resetDialogText={resetDialogText}
			resetConfirmButtonText={confirmButtonText}
		/>
	);
}

// Each origin (theme / default / custom) is memoized so one group’s dialog or list does not re-render the others.
const FilterPresetGroup = memo(FilterPresetGroupComponent);

/**
 * Reads/writes `settings.filter` in user theme.json — same layout as `settings.transform`
 * (presets.theme | default | custom, optional defaultPresets), with each preset’s `items`
 * array storing filter rows (blur, drop-shadow, color adjustments, etc.).
 */
export function FiltersPresetContent() {
	const [rawThemePresets, setThemePresets] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.FILTER_PRESETS_THEME
	);

	const [baseThemePresets] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.FILTER_PRESETS_THEME,
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.FILTER_PRESETS_DEFAULT
	);

	const [baseDefaultPresets] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.FILTER_PRESETS_DEFAULT,
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.FILTER_PRESETS_CUSTOM
	);

	const [defaultFilterPresetsEnabled = true] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.FILTER_DEFAULT_PRESETS
	);

	const themePresets = useMemo(
		() => sanitizeFilterPresets(rawThemePresets),
		[rawThemePresets]
	);
	const defaultPresets = useMemo(
		() => sanitizeFilterPresets(rawDefaultPresets),
		[rawDefaultPresets]
	);
	const customPresets = useMemo(
		() => sanitizeFilterPresets(rawCustomPresets),
		[rawCustomPresets]
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): WpFilterPreset[] =>
			sanitizeFilterPresets(
				Object.values(
					newValue as Record<
						string,
						WpFilterPreset & Record<string, unknown>
					>
				).map((value) => ({
					slug: value.slug,
					name: value.name,
					items: value.items,
					isVisible: value.isVisible,
				}))
			),
		[]
	);

	const persistThemeSizes = useCallback(
		(next: WpFilterPreset[]) => {
			setThemePresets(next);
		},
		[setThemePresets]
	);

	const persistDefaultSizes = useCallback(
		(next: WpFilterPreset[]) => {
			setDefaultPresets(next);
		},
		[setDefaultPresets]
	);

	const persistCustomSizes = useCallback(
		(next: WpFilterPreset[]) => {
			setCustomPresets(next);
		},
		[setCustomPresets]
	);

	const resetThemeToBase = useCallback(() => {
		setThemePresets(sanitizeFilterPresets(baseThemePresets));
	}, [setThemePresets, baseThemePresets]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultPresets(sanitizeFilterPresets(baseDefaultPresets));
	}, [setDefaultPresets, baseDefaultPresets]);

	const clearCustomSizes = useCallback(() => {
		setCustomPresets([]);
	}, [setCustomPresets]);

	const themeResetHandler = useMemo(() => {
		if (!themePresets?.length) {
			return undefined;
		}
		const base = sanitizeFilterPresets(baseThemePresets ?? []);
		if (isEquals(themePresets, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themePresets, baseThemePresets, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultPresets?.length) {
			return undefined;
		}
		const base = sanitizeFilterPresets(baseDefaultPresets ?? []);
		if (isEquals(defaultPresets, base)) {
			return undefined;
		}
		return resetDefaultToBase;
	}, [defaultPresets, baseDefaultPresets, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customPresets.length > 0 ? clearCustomSizes : undefined),
		[customPresets.length, clearCustomSizes]
	);

	const defaultLayerOn = defaultFilterPresetsEnabled !== false;
	const showDefaultGroup = shouldShowDefaultPresetGroup(
		defaultLayerOn,
		themePresets.length,
		defaultPresets.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		defaultLayerOn,
		themePresets.length,
		defaultPresets.length
	);

	const baseThemeSizes = useMemo(
		() => sanitizeFilterPresets(baseThemePresets),
		[baseThemePresets]
	);

	const baseDefaultSizes = useMemo(
		() => sanitizeFilterPresets(baseDefaultPresets),
		[baseDefaultPresets]
	);

	const originSets = useMemo(
		() =>
			buildVisiblePresetOriginSets({
				showThemeOriginGroup,
				showDefaultOriginGroup: showDefaultGroup,
				themeItems: themePresets,
				themeBaseItems: baseThemeSizes,
				defaultItems: defaultPresets,
				defaultBaseItems: baseDefaultSizes,
				customItems: customPresets,
			}),
		[
			showThemeOriginGroup,
			showDefaultGroup,
			themePresets,
			baseThemeSizes,
			defaultPresets,
			baseDefaultSizes,
			customPresets,
		]
	);

	return (
		<Flex
			direction="column"
			gap={PRESET_VARIABLES_SECTION_GAP}
			style={{ width: '100%' }}
		>
			<PresetVariablesScreenToolbar originSets={originSets} />
			{showThemeOriginGroup && (
				<FilterPresetGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themePresets}
					baseSizes={baseThemeSizes}
					persistSizes={persistThemeSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultGroup && (
				<FilterPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					persistSizes={persistDefaultSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<FilterPresetGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customPresets}
				persistSizes={persistCustomSizes}
				convertRepeaterToItems={convertRepeaterValueToArray}
				handleResetPresets={customResetHandler}
			/>
		</Flex>
	);
}

export function Filters({ closeCallback }: { closeCallback?: () => void }) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-filters-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={__('Filter Variables', 'blockera')}
				closeCallback={closeCallback}
			/>

			<Flex
				direction="column"
				gap="16px"
				className="blockera-filters-presets"
				style={{
					width: '100%',
					marginTop: '10px',
					paddingBottom: '10px',
				}}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit filter variables used for blur, drop-shadow, and color adjustments.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<PresetVariablesViewModeProvider>
						<FiltersPresetContent />
					</PresetVariablesViewModeProvider>
				</Flex>
			</Flex>
		</div>
	);
}

export default Filters;
