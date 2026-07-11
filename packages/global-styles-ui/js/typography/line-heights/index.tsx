/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	__experimentalView as View,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import { memo, useMemo, useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	PresetVariablesViewModeProvider,
	PRESET_VARIABLES_SECTION_GAP,
} from '@blockera/controls';
import {
	normalizeSizeThemeJsonPreset,
	BLOCKERA_GLOBAL_SETTING_PATH,
} from '@blockera/data';
import { isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	ScreenHeader,
	getNewIndexFromPresets,
	createPresetFieldsPropsResolver,
	getOriginResetDialogCopy,
	getOriginVariablesLabel,
	shouldShowDefaultPresetGroup,
	shouldShowThemePresetGroup,
	withPresetMetaFromRepeaterRow,
	PresetTaxonomyGroupLayout,
	PresetVariablesScreenToolbar,
	buildVisiblePresetOriginSets,
} from '../../components';
import { LineHeight } from './line-height';
import { useGlobalSetting } from '../../context/global-style-hooks';
import { type VariableType } from '../../components/types';
import { LineHeightPresetOpener } from './line-height-preset-opener';

type LineHeightPreset = {
	slug: string;
	name: string;
	size: string;
};

interface LineHeightGroupProps {
	label: string;
	origin: string;
	sizes: LineHeightPreset[];
	baseSizes?: LineHeightPreset[];
	persistSizes?: (items: LineHeightPreset[]) => void;
	convertRepeaterToItems: (
		newValue: object,
		baseline: LineHeightPreset[]
	) => LineHeightPreset[];
	handleResetLineHeights?: () => void;
}

export type DefaultPresetValue = {
	size: string;
	isVisible: boolean;
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
};

const lineHeightPresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('lineHeight');

function normalizeLineHeightPresetsForUi(
	presets: LineHeightPreset[] | void | null
): LineHeightPreset[] {
	if (!Array.isArray(presets)) {
		return [];
	}

	return presets.map(
		(preset) => normalizeSizeThemeJsonPreset(preset) as LineHeightPreset
	);
}

function LineHeightGroupComponent({
	sizes,
	baseSizes,
	origin,
	persistSizes,
	convertRepeaterToItems,
	handleResetLineHeights,
}: LineHeightGroupProps) {
	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('line height', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'line-height-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): DefaultPresetValue &
		VariableType => {
		return {
			size: '1.5',
			isVisible: true,
			slug: `line-height-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: line height index */
			name: sprintf(__('Line Height %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `line-height-presets-${origin}`;

	const onPersistItems = useCallback(
		(next: LineHeightPreset[]) => {
			persistSizes?.(next);
		},
		[persistSizes]
	);

	return (
		<PresetTaxonomyGroupLayout<LineHeightPreset & Record<string, unknown>>
			origin={origin}
			items={sizes}
			baseItems={baseSizes}
			controlName={controlName}
			convertRepeaterToItems={convertRepeaterToItems}
			onPersistItems={onPersistItems}
			PresetFields={LineHeight}
			repeaterItemHeader={LineHeightPresetOpener}
			presetFieldsPropsResolver={lineHeightPresetFieldsPropsResolver}
			defaultPresetValue={defaultPresetValue}
			title={__('Line Height', 'blockera')}
			label={getOriginVariablesLabel(origin)}
			handleReset={handleResetLineHeights}
			resetDialogText={resetDialogText}
			resetConfirmButtonText={confirmButtonText}
		/>
	);
}

const LineHeightGroup = memo(LineHeightGroupComponent);

export function LineHeightsPresetContent() {
	const [themeLineHeights, setThemeLineHeights] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.LINE_HEIGHTS_THEME
	);

	const [baseThemeLineHeights] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.LINE_HEIGHTS_THEME,
		'',
		'base'
	);
	const [defaultLineHeights, setDefaultLineHeights] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.LINE_HEIGHTS_DEFAULT
	);

	const [baseDefaultLineHeights] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.LINE_HEIGHTS_DEFAULT,
		'',
		'base'
	);

	const [customLineHeights = [], setCustomLineHeights] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.LINE_HEIGHTS_CUSTOM
	);

	const [defaultLineHeightsEnabled] = useGlobalSetting(
		BLOCKERA_GLOBAL_SETTING_PATH.DEFAULT_LINE_HEIGHTS
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): LineHeightPreset[] =>
			Object.values(
				newValue as Record<
					string,
					LineHeightPreset & Record<string, unknown>
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
		(next: LineHeightPreset[]) => {
			setThemeLineHeights(next);
		},
		[setThemeLineHeights]
	);

	const persistDefaultSizes = useCallback(
		(next: LineHeightPreset[]) => {
			setDefaultLineHeights(next);
		},
		[setDefaultLineHeights]
	);

	const persistCustomSizes = useCallback(
		(next: LineHeightPreset[]) => {
			setCustomLineHeights(next);
		},
		[setCustomLineHeights]
	);

	const resetThemeToBase = useCallback(() => {
		setThemeLineHeights(baseThemeLineHeights);
	}, [setThemeLineHeights, baseThemeLineHeights]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultLineHeights(baseDefaultLineHeights);
	}, [setDefaultLineHeights, baseDefaultLineHeights]);

	const clearCustomSizes = useCallback(() => {
		setCustomLineHeights([]);
	}, [setCustomLineHeights]);

	const themeResetHandler = useMemo(() => {
		if (!themeLineHeights?.length) {
			return undefined;
		}
		const base = baseThemeLineHeights ?? [];
		if (isEquals(themeLineHeights, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themeLineHeights, baseThemeLineHeights, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultLineHeights?.length) {
			return undefined;
		}
		const base = baseDefaultLineHeights ?? [];
		if (isEquals(defaultLineHeights, base)) {
			return undefined;
		}
		return resetDefaultToBase;
	}, [defaultLineHeights, baseDefaultLineHeights, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customLineHeights.length > 0 ? clearCustomSizes : undefined),
		[customLineHeights.length, clearCustomSizes]
	);

	const themeSizes = useMemo(
		() =>
			normalizeLineHeightPresetsForUi(
				themeLineHeights as LineHeightPreset[]
			),
		[themeLineHeights]
	);
	const defaultSizes = useMemo(
		() =>
			normalizeLineHeightPresetsForUi(
				defaultLineHeights as LineHeightPreset[]
			),
		[defaultLineHeights]
	);
	const customSizesForUi = useMemo(
		() =>
			normalizeLineHeightPresetsForUi(
				customLineHeights as LineHeightPreset[]
			),
		[customLineHeights]
	);
	const showDefaultOriginGroup = shouldShowDefaultPresetGroup(
		!!defaultLineHeightsEnabled,
		themeSizes.length,
		defaultSizes.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		!!defaultLineHeightsEnabled,
		themeSizes.length,
		defaultSizes.length
	);

	const baseThemeSizes = useMemo(
		() =>
			normalizeLineHeightPresetsForUi(
				baseThemeLineHeights as LineHeightPreset[]
			),
		[baseThemeLineHeights]
	);

	const baseDefaultSizes = useMemo(
		() =>
			normalizeLineHeightPresetsForUi(
				baseDefaultLineHeights as LineHeightPreset[]
			),
		[baseDefaultLineHeights]
	);

	const originSets = useMemo(
		() =>
			buildVisiblePresetOriginSets({
				showThemeOriginGroup,
				showDefaultOriginGroup,
				themeItems: themeSizes,
				themeBaseItems: baseThemeSizes,
				defaultItems: defaultSizes,
				defaultBaseItems: baseDefaultSizes,
				customItems: customSizesForUi,
			}),
		[
			showThemeOriginGroup,
			showDefaultOriginGroup,
			themeSizes,
			baseThemeSizes,
			defaultSizes,
			baseDefaultSizes,
			customSizesForUi,
		]
	);

	return (
		<Flex
			direction="column"
			gap={PRESET_VARIABLES_SECTION_GAP}
			className="blockera-line-height-editor-groups"
		>
			<PresetVariablesScreenToolbar originSets={originSets} />
			{showThemeOriginGroup && (
				<LineHeightGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themeSizes}
					baseSizes={baseThemeSizes}
					persistSizes={persistThemeSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetLineHeights={themeResetHandler}
				/>
			)}

			{showDefaultOriginGroup && (
				<LineHeightGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultSizes}
					persistSizes={persistDefaultSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetLineHeights={defaultResetHandler}
				/>
			)}

			<LineHeightGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customSizesForUi}
				persistSizes={persistCustomSizes}
				convertRepeaterToItems={convertRepeaterValueToArray}
				handleResetLineHeights={customResetHandler}
			/>
		</Flex>
	);
}

export function LineHeightsEditorScreen({
	onBackHandler,
}: {
	onBackHandler: () => void;
}) {
	return (
		<Flex
			direction="column"
			gap={0}
			className="blockera-line-height-editor"
			style={{ paddingBottom: '10px' }}
		>
			<ScreenHeader
				onBack={onBackHandler}
				title={__('Line Height Variables', 'blockera')}
				description={__(
					'Create and edit line height variables used for typography across the site.',
					'blockera'
				)}
			/>

			<View>
				<Spacer paddingX={4}>
					<PresetVariablesViewModeProvider>
						<LineHeightsPresetContent />
					</PresetVariablesViewModeProvider>
				</Spacer>
			</View>
		</Flex>
	);
}
