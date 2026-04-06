/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useCallback, useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { isEquals, pascalCase } from '@blockera/utils';
import { classNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import {
	PresetGroup,
	getNewIndexFromPresets,
	type PresetGroupPropsType,
	type PresetFieldsPropsResolver,
} from '../components';
import { useGlobalSetting } from '../../context/hooks';
import { type VariableType } from '../components/types';
import { FilterPresetOpener } from './filter-preset-opener';
import {
	FilterPresetSize,
	type FilterDefaultPresetValue,
} from './filter-preset-size';
import { sanitizeFilterPresets, type WpFilterPreset } from './utils';
import { NavItemBackButton } from '../../../../navigation/nav-item-back-button';
import ConfirmResetFontSizesDialog from '../font-sizes/confirm-reset-font-sizes-dialog';

type FilterPresetGroup = {
	defaultPresetValue: FilterDefaultPresetValue & {
		slug: string;
		name: string;
	};
};

type FilterPresetGroupProps = PresetGroupPropsType & FilterPresetGroup;

const filterPresetFieldsPropsResolver: PresetFieldsPropsResolver = (
	item,
	itemId,
	origin
) => ({
	origin,
	filterPreset: item,
	presetId: itemId,
});

const FILTER_PRESET_ADD_MODAL_CONFIG = {
	headerTitle: __('Add Filter Preset', 'blockera'),
	description: __(
		'Name your new filter preset. The ID will be generated from the name and used in your styles.',
		'blockera'
	),
	duplicateSlugMessage: __(
		'This ID is already used by another filter preset.',
		'blockera'
	),
	controlNamePrefix: 'add-filter-preset',
};

function FilterBoxPresetGroupComponent(props: FilterPresetGroupProps) {
	return <PresetGroup {...props} />;
}

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
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = useCallback(() => {
		setIsResetDialogOpen((open) => !open);
	}, []);

	const resetDialogText = useMemo(
		() =>
			origin === 'custom'
				? __(
						'Are you sure you want to remove all custom filter presets?',
						'blockera'
					)
				: __(
						'Are you sure you want to reset all filter presets to their default values?',
						'blockera'
					),
		[origin]
	);

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'custom-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): FilterDefaultPresetValue &
		VariableType & { slug: string; name: string } => {
		return {
			items: [
				{
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
				<ConfirmResetFontSizesDialog
					text={resetDialogText}
					confirmButtonText={
						origin === 'custom'
							? __('Remove', 'blockera')
							: __('Reset', 'blockera')
					}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetPresets}
				/>
			)}
			<FilterBoxPresetGroupComponent
				repeaterItemHeader={FilterPresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={FilterPresetSize}
				title={__('Filters', 'blockera')}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
				addVariableModalConfig={FILTER_PRESET_ADD_MODAL_CONFIG}
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
function FiltersPresetContent() {
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

	const showDefaultGroup =
		defaultFilterPresetsEnabled !== false && !!defaultPresets?.length;

	return (
		<Flex direction="column" gap="32px" style={{ width: '100%' }}>
			{!!themePresets?.length && (
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

export function Filters({
	backLabel,
	closeCallback,
}: {
	backLabel: string;
	closeCallback?: () => void;
}) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-filters-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={backLabel}
				closeCallback={closeCallback}
			/>
			<Flex
				direction="column"
				gap="8px"
				className="blockera-filters-presets"
				style={{ width: '100%' }}
			>
				<Flex
					direction="column"
					gap="8px"
					style={{ padding: '12px 16px', width: '100%' }}
				>
					<p className="global-styles-ui-header__description">
						{__(
							'Create and edit filter presets used in filter controls (theme.json settings.filter.presets: slug, name, and items with blur, drop-shadow, and color adjustment rows).',
							'blockera'
						)}
					</p>
				</Flex>

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
