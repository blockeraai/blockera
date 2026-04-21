/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { isEquals } from '@blockera/utils';
import { classNames } from '@blockera/classnames';

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
	GlobalStylesPanelDescription,
	shouldShowDefaultPresetGroup,
	shouldShowThemePresetGroup,
	usePresetResetDialogState,
} from '../components';
import { useGlobalSetting } from '../context/global-style-hooks';
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
	origin,
	handleUpdateSizes,
	handleResetPresets,
}: {
	label: string;
	origin: string;
	sizes: WpFilterPreset[];
	handleUpdateSizes?: (newValue: Object) => void;
	handleResetPresets?: () => void;
}) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

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

	const handleChange = useCallback(
		(newValue: Object) => {
			if (!handleUpdateSizes) {
				return;
			}
			handleUpdateSizes(newValue);
		},
		[handleUpdateSizes]
	);

	return (
		<>
			{handleResetPresets && isResetDialogOpen && (
				<ConfirmResetPresetDialog
					text={resetDialogText}
					confirmButtonText={confirmButtonText}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetPresets}
				/>
			)}
			<PresetGroup
				repeaterItemHeader={FilterPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={FilterPresetSize}
				title={__('Filters', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				presetFieldsPropsResolver={filterPresetFieldsPropsResolver}
			/>
		</>
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
		'filter.presets.theme'
	);

	const [baseThemePresets] = useGlobalSetting(
		'filter.presets.theme',
		'',
		'base'
	);
	const [rawDefaultPresets, setDefaultPresets] = useGlobalSetting(
		'filter.presets.default'
	);

	const [baseDefaultPresets] = useGlobalSetting(
		'filter.presets.default',
		'',
		'base'
	);

	const [rawCustomPresets = [], setCustomPresets] = useGlobalSetting(
		'filter.presets.custom'
	);

	const [defaultFilterPresetsEnabled = true] = useGlobalSetting(
		'filter.defaultPresets'
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

	const handleUpdateCustomSizes = useCallback(
		(newValue: Object) => {
			setCustomPresets(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setCustomPresets]
	);

	const handleUpdateThemeSizes = useCallback(
		(newValue: Object) => {
			setThemePresets(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setThemePresets]
	);

	const handleUpdateDefaultSizes = useCallback(
		(newValue: Object) => {
			setDefaultPresets(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setDefaultPresets]
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

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{showThemeOriginGroup && (
				<FilterPresetGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themePresets}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetPresets={themeResetHandler}
				/>
			)}

			{showDefaultGroup && (
				<FilterPresetGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultPresets}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetPresets={defaultResetHandler}
				/>
			)}

			<FilterPresetGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customPresets}
				handleUpdateSizes={handleUpdateCustomSizes}
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
					<FiltersPresetContent />
				</Flex>
			</Flex>
		</div>
	);
}

export default Filters;
