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
import { normalizeSizeThemeJsonPreset } from '@blockera/data';
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
	withPresetMetaFromRepeaterRow,
	PresetTaxonomyGroupLayout,
	PresetVariablesScreenToolbar,
	buildVisiblePresetOriginSets,
} from '../components';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { SpacingPresetOpener } from './spacing-preset-opener';
import { SpacingPresetPreviewUsageProvider } from './spacing-preset-preview-context';
import { SpacingSize, type SpacingDefaultPresetValue } from './spacing-size';
import { NavItemBackButton } from '../navigation/nav-item-back-button';
import type { SpacingSizePresetUsage } from './spacing-preset-preview-usage';

export type { SpacingDefaultPresetValue };
export type { SpacingSizePresetUsage } from './spacing-preset-preview-usage';

type SpacingSizePreset = {
	slug: string;
	name: string;
	size: string;
};

const spacingPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('spacingSize');

function normalizeSpacingPresetsForUi(
	presets: SpacingSizePreset[] | void | null
): SpacingSizePreset[] {
	if (!Array.isArray(presets)) {
		return [];
	}

	return presets.map(
		(preset) => normalizeSizeThemeJsonPreset(preset) as SpacingSizePreset
	);
}

function SpacingSizeGroupComponent({
	sizes,
	baseSizes,
	origin,
	persistSizes,
	handleResetSpacingSizes,
	convertRepeaterToItems,
}: {
	label: string;
	origin: string;
	sizes: SpacingSizePreset[];
	baseSizes?: SpacingSizePreset[];
	persistSizes?: (items: SpacingSizePreset[]) => void;
	convertRepeaterToItems: (
		newValue: object,
		baseline: SpacingSizePreset[]
	) => SpacingSizePreset[];
	handleResetSpacingSizes?: () => void;
}) {
	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('spacing size', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'spacing-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): SpacingDefaultPresetValue &
		VariableType => {
		return {
			size: '20px',
			isVisible: true,
			slug: `spacing-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: spacing preset index */
			name: sprintf(__('Spacing %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `spacing-size-presets-${origin}`;

	const onPersistItems = useCallback(
		(next: SpacingSizePreset[]) => {
			persistSizes?.(next);
		},
		[persistSizes]
	);

	return (
		<PresetTaxonomyGroupLayout<SpacingSizePreset & Record<string, unknown>>
			origin={origin}
			items={sizes}
			baseItems={baseSizes}
			controlName={controlName}
			convertRepeaterToItems={convertRepeaterToItems}
			onPersistItems={onPersistItems}
			PresetFields={SpacingSize}
			repeaterItemHeader={SpacingPresetOpener}
			presetFieldsPropsResolver={spacingPresetFieldsPropsResolver}
			defaultPresetValue={defaultPresetValue}
			title={__('Spacing Size', 'blockera')}
			label={getOriginVariablesLabel(origin)}
			handleReset={handleResetSpacingSizes}
			resetDialogText={resetDialogText}
			resetConfirmButtonText={confirmButtonText}
		/>
	);
}

const SpacingSizeGroup = memo(SpacingSizeGroupComponent);

export function SpacingPresetContent({
	previewUsage,
}: {
	/** When this screen is embedded (e.g. design system), sets row hover preview mode. */
	previewUsage?: SpacingSizePresetUsage;
} = {}) {
	const [themeSpacingSizes, setThemeSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.theme',
		''
	);

	const [baseThemeSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.theme',
		'',
		'base'
	);
	const [defaultSpacingSizes, setDefaultSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.default',
		''
	);

	const [baseDefaultSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.default',
		'',
		'base'
	);

	const [customSpacingSizes = [], setCustomSpacingSizes] = useGlobalSetting(
		'spacing.spacingSizes.custom',
		''
	);

	const [defaultSpacingSizesEnabled] = useGlobalSetting(
		'spacing.defaultSpacingSizes',
		''
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): SpacingSizePreset[] =>
			Object.values(
				newValue as Record<
					string,
					SpacingSizePreset & Record<string, unknown>
				>
			).map((value) =>
				withPresetMetaFromRepeaterRow(value, {
					slug: value.slug,
					name: value.name,
					size: value.size,
					isVisible: value.isVisible,
				})
			),
		[]
	);

	const persistThemeSizes = useCallback(
		(next: SpacingSizePreset[]) => {
			setThemeSpacingSizes(next);
		},
		[setThemeSpacingSizes]
	);

	const persistDefaultSizes = useCallback(
		(next: SpacingSizePreset[]) => {
			setDefaultSpacingSizes(next);
		},
		[setDefaultSpacingSizes]
	);

	const persistCustomSizes = useCallback(
		(next: SpacingSizePreset[]) => {
			setCustomSpacingSizes(next);
		},
		[setCustomSpacingSizes]
	);

	const resetThemeToBase = useCallback(() => {
		setThemeSpacingSizes(baseThemeSpacingSizes);
	}, [setThemeSpacingSizes, baseThemeSpacingSizes]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultSpacingSizes(baseDefaultSpacingSizes);
	}, [setDefaultSpacingSizes, baseDefaultSpacingSizes]);

	const clearCustomSizes = useCallback(() => {
		setCustomSpacingSizes([]);
	}, [setCustomSpacingSizes]);

	const themeResetHandler = useMemo(() => {
		if (!Array.isArray(themeSpacingSizes) || themeSpacingSizes.length < 1) {
			return undefined;
		}
		const base = baseThemeSpacingSizes ?? [];
		if (isEquals(themeSpacingSizes, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themeSpacingSizes, baseThemeSpacingSizes, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (
			!Array.isArray(defaultSpacingSizes) ||
			defaultSpacingSizes.length < 1
		) {
			return undefined;
		}
		const base = baseDefaultSpacingSizes ?? [];
		if (isEquals(defaultSpacingSizes, base)) {
			return undefined;
		}
		return resetDefaultToBase;
	}, [defaultSpacingSizes, baseDefaultSpacingSizes, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() =>
			Array.isArray(customSpacingSizes) && customSpacingSizes.length > 0
				? clearCustomSizes
				: undefined,
		[customSpacingSizes, clearCustomSizes]
	);

	const themeSizes = useMemo(
		() =>
			normalizeSpacingPresetsForUi(
				themeSpacingSizes as SpacingSizePreset[]
			),
		[themeSpacingSizes]
	);
	const defaultSizes = useMemo(
		() =>
			normalizeSpacingPresetsForUi(
				defaultSpacingSizes as SpacingSizePreset[]
			),
		[defaultSpacingSizes]
	);
	const customSizesForUi = useMemo(
		() =>
			normalizeSpacingPresetsForUi(
				customSpacingSizes as SpacingSizePreset[]
			),
		[customSpacingSizes]
	);
	const showDefaultOriginGroup = shouldShowDefaultPresetGroup(
		!!defaultSpacingSizesEnabled,
		themeSizes.length,
		defaultSizes.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		!!defaultSpacingSizesEnabled,
		themeSizes.length,
		defaultSizes.length
	);

	const baseThemeSizes = useMemo(
		() =>
			normalizeSpacingPresetsForUi(
				baseThemeSpacingSizes as SpacingSizePreset[]
			),
		[baseThemeSpacingSizes]
	);

	const originSets = useMemo(
		() =>
			buildVisiblePresetOriginSets({
				showThemeOriginGroup,
				showDefaultOriginGroup,
				themeItems: themeSizes,
				themeBaseItems: baseThemeSizes,
				defaultItems: defaultSizes,
				defaultBaseItems: baseDefaultSpacingSizes
					? normalizeSpacingPresetsForUi(baseDefaultSpacingSizes)
					: undefined,
				customItems: customSizesForUi,
			}),
		[
			showThemeOriginGroup,
			showDefaultOriginGroup,
			themeSizes,
			baseThemeSizes,
			defaultSizes,
			baseDefaultSpacingSizes,
			customSizesForUi,
		]
	);

	return (
		<SpacingPresetPreviewUsageProvider value={previewUsage}>
			<PresetVariablesScreenToolbar originSets={originSets} />
			<Flex
				direction="column"
				gap={PRESET_VARIABLES_SECTION_GAP}
				style={{ width: '100%' }}
			>
				{showThemeOriginGroup && (
					<SpacingSizeGroup
						origin="theme"
						label={__('Theme', 'blockera')}
						sizes={themeSizes}
						baseSizes={baseThemeSizes}
						persistSizes={persistThemeSizes}
						convertRepeaterToItems={convertRepeaterValueToArray}
						handleResetSpacingSizes={themeResetHandler}
					/>
				)}

				{showDefaultOriginGroup && (
					<SpacingSizeGroup
						origin="default"
						label={__('Default', 'blockera')}
						sizes={defaultSizes}
						persistSizes={persistDefaultSizes}
						convertRepeaterToItems={convertRepeaterValueToArray}
						handleResetSpacingSizes={defaultResetHandler}
					/>
				)}

				<SpacingSizeGroup
					origin="custom"
					label={__('Custom', 'blockera')}
					sizes={customSizesForUi}
					persistSizes={persistCustomSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetSpacingSizes={customResetHandler}
				/>
			</Flex>
		</SpacingPresetPreviewUsageProvider>
	);
}

export function Spacing({
	closeCallback,
	previewUsage,
}: {
	closeCallback?: () => void;
	previewUsage?: SpacingSizePresetUsage;
}) {
	return (
		<div
			className={classNames(
				'blockera-navigation-panel',
				'blockera-spacing-presets-navigation'
			)}
		>
			<NavItemBackButton
				backLabel={__('Spacing Variables', 'blockera')}
				closeCallback={closeCallback}
			/>

			<Flex
				direction="column"
				gap="16px"
				className="blockera-spacing-presets"
				style={{
					width: '100%',
					marginTop: '10px',
					paddingBottom: '10px',
				}}
			>
				<GlobalStylesPanelDescription>
					{__(
						'Create and edit spacing variables used for margin, padding, and gap.',
						'blockera'
					)}
				</GlobalStylesPanelDescription>

				<Flex
					direction="column"
					style={{ padding: '0 16px', width: '100%' }}
				>
					<PresetVariablesViewModeProvider>
						<SpacingPresetContent previewUsage={previewUsage} />
					</PresetVariablesViewModeProvider>
				</Flex>
			</Flex>
		</div>
	);
}

export { SpacingPresetPreviewUsageProvider };

export default Spacing;
