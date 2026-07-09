/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	__experimentalView as View,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import { memo, useMemo, useCallback } from '@wordpress/element';
import type { FontSize as FontSizeType } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import {
	Flex,
	PresetVariablesViewModeProvider,
	PRESET_VARIABLES_SECTION_GAP,
} from '@blockera/controls';
import { normalizeFontSizeThemeJsonPreset } from '@blockera/data';
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
import { FontSize } from './font-size';
import { useGlobalSetting } from '../../context/global-style-hooks';
import { type VariableType } from '../../components/types';
import { FontSizePresetOpener } from './font-size-preset-opener';

interface FontSizeGroupProps {
	label: string;
	origin: string;
	sizes: FontSizeType[];
	baseSizes?: FontSizeType[];
	persistSizes?: (items: FontSizeType[]) => void;
	convertRepeaterToItems: (
		newValue: object,
		baseline: FontSizeType[]
	) => FontSizeType[];
	handleResetFontSizes?: () => void;
}

export type DefaultPresetValue = {
	size: string;
	isVisible: boolean;
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
	fluid: boolean | { min: string; max: string };
};

const fontSizePresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('fontSize');

function normalizeFontSizePresetsForUi(
	presets: FontSizeType[] | void | null
): FontSizeType[] {
	if (!Array.isArray(presets)) {
		return [];
	}

	return presets.map(
		(preset) => normalizeFontSizeThemeJsonPreset(preset) as FontSizeType
	);
}

function FontSizeGroupComponent({
	sizes,
	baseSizes,
	origin,
	persistSizes,
	convertRepeaterToItems,
	handleResetFontSizes,
}: FontSizeGroupProps) {
	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, __('font size', 'blockera'));

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'font-size-'),
		[sizes]
	);

	const defaultPresetValue = useMemo((): DefaultPresetValue &
		VariableType => {
		return {
			size: '16px',
			fluid: false,
			isVisible: true,
			slug: `font-size-${index}`,
			deletable: !!('custom' === origin),
			cloneable: !!('custom' === origin),
			visibilitySupport: !!('custom' === origin),
			/* translators: %d: font size index */
			name: sprintf(__('Font Size %d', 'blockera'), index) as string,
		};
	}, [origin, index]);

	const controlName = `font-size-presets-${origin}`;

	const onPersistItems = useCallback(
		(next: FontSizeType[]) => {
			persistSizes?.(next);
		},
		[persistSizes]
	);

	return (
		<PresetTaxonomyGroupLayout<FontSizeType & Record<string, unknown>>
			origin={origin}
			items={sizes}
			baseItems={baseSizes}
			controlName={controlName}
			convertRepeaterToItems={convertRepeaterToItems}
			onPersistItems={onPersistItems}
			PresetFields={FontSize}
			repeaterItemHeader={FontSizePresetOpener}
			presetFieldsPropsResolver={fontSizePresetFieldsPropsResolver}
			defaultPresetValue={defaultPresetValue}
			title={__('Font Size', 'blockera')}
			label={getOriginVariablesLabel(origin)}
			handleReset={handleResetFontSizes}
			resetDialogText={resetDialogText}
			resetConfirmButtonText={confirmButtonText}
		/>
	);
}

const FontSizeGroup = memo(FontSizeGroupComponent);

export function FontSizesPresetContent() {
	const [themeFontSizes, setThemeFontSizes] = useGlobalSetting(
		'typography.fontSizes.theme'
	);

	const [baseThemeFontSizes] = useGlobalSetting(
		'typography.fontSizes.theme',
		'',
		'base'
	);
	const [defaultFontSizes, setDefaultFontSizes] = useGlobalSetting(
		'typography.fontSizes.default'
	);

	const [baseDefaultFontSizes] = useGlobalSetting(
		'typography.fontSizes.default',
		'',
		'base'
	);

	const [customFontSizes = [], setCustomFontSizes] = useGlobalSetting(
		'typography.fontSizes.custom'
	);

	const [defaultFontSizesEnabled] = useGlobalSetting(
		'typography.defaultFontSizes'
	);

	const convertRepeaterValueToArray = useCallback(
		(newValue: Object): FontSizeType[] =>
			Object.values(
				newValue as Record<
					string,
					FontSizeType & Record<string, unknown>
				>
			).map((value) =>
				withPresetMetaFromRepeaterRow(value, {
					slug: value.slug,
					name: value.name,
					size: value.size,
					fluid: value.fluid,
					isVisible: value.isVisible,
				})
			),
		[]
	);

	const persistThemeSizes = useCallback(
		(next: FontSizeType[]) => {
			setThemeFontSizes(next);
		},
		[setThemeFontSizes]
	);

	const persistDefaultSizes = useCallback(
		(next: FontSizeType[]) => {
			setDefaultFontSizes(next);
		},
		[setDefaultFontSizes]
	);

	const persistCustomSizes = useCallback(
		(next: FontSizeType[]) => {
			setCustomFontSizes(next);
		},
		[setCustomFontSizes]
	);

	const resetThemeToBase = useCallback(() => {
		setThemeFontSizes(baseThemeFontSizes);
	}, [setThemeFontSizes, baseThemeFontSizes]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultFontSizes(baseDefaultFontSizes);
	}, [setDefaultFontSizes, baseDefaultFontSizes]);

	const clearCustomSizes = useCallback(() => {
		setCustomFontSizes([]);
	}, [setCustomFontSizes]);

	const themeResetHandler = useMemo(() => {
		if (!themeFontSizes?.length) {
			return undefined;
		}
		const base = baseThemeFontSizes ?? [];
		if (isEquals(themeFontSizes, base)) {
			return undefined;
		}
		return resetThemeToBase;
	}, [themeFontSizes, baseThemeFontSizes, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!defaultFontSizes?.length) {
			return undefined;
		}
		const base = baseDefaultFontSizes ?? [];
		if (isEquals(defaultFontSizes, base)) {
			return undefined;
		}
		return resetDefaultToBase;
	}, [defaultFontSizes, baseDefaultFontSizes, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customFontSizes.length > 0 ? clearCustomSizes : undefined),
		[customFontSizes.length, clearCustomSizes]
	);

	const themeSizes = useMemo(
		() => normalizeFontSizePresetsForUi(themeFontSizes as FontSizeType[]),
		[themeFontSizes]
	);
	const defaultSizes = useMemo(
		() => normalizeFontSizePresetsForUi(defaultFontSizes as FontSizeType[]),
		[defaultFontSizes]
	);
	const customSizesForUi = useMemo(
		() => normalizeFontSizePresetsForUi(customFontSizes as FontSizeType[]),
		[customFontSizes]
	);
	const showDefaultOriginGroup = shouldShowDefaultPresetGroup(
		!!defaultFontSizesEnabled,
		themeSizes.length,
		defaultSizes.length
	);
	const showThemeOriginGroup = shouldShowThemePresetGroup(
		!!defaultFontSizesEnabled,
		themeSizes.length,
		defaultSizes.length
	);

	const baseThemeSizes = useMemo(
		() =>
			normalizeFontSizePresetsForUi(baseThemeFontSizes as FontSizeType[]),
		[baseThemeFontSizes]
	);

	const baseDefaultSizes = useMemo(
		() =>
			normalizeFontSizePresetsForUi(
				baseDefaultFontSizes as FontSizeType[]
			),
		[baseDefaultFontSizes]
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
			className="blockera-font-size-editor-groups"
		>
			<PresetVariablesScreenToolbar originSets={originSets} />
			{showThemeOriginGroup && (
				<FontSizeGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themeSizes}
					baseSizes={baseThemeSizes}
					persistSizes={persistThemeSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetFontSizes={themeResetHandler}
				/>
			)}

			{showDefaultOriginGroup && (
				<FontSizeGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultSizes}
					persistSizes={persistDefaultSizes}
					convertRepeaterToItems={convertRepeaterValueToArray}
					handleResetFontSizes={defaultResetHandler}
				/>
			)}

			<FontSizeGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customSizesForUi}
				persistSizes={persistCustomSizes}
				convertRepeaterToItems={convertRepeaterValueToArray}
				handleResetFontSizes={customResetHandler}
			/>
		</Flex>
	);
}

export function FontSizesEditorScreen({
	onBackHandler,
}: {
	onBackHandler: () => void;
}) {
	return (
		<Flex
			direction="column"
			gap={0}
			className="blockera-font-size-editor"
			style={{ paddingBottom: '10px' }}
		>
			<ScreenHeader
				onBack={onBackHandler}
				title={__('Font Size Variables', 'blockera')}
				description={__(
					'Create and edit font size variables used for typography across the site.',
					'blockera'
				)}
			/>

			<View>
				<Spacer paddingX={4}>
					<PresetVariablesViewModeProvider>
						<FontSizesPresetContent />
					</PresetVariablesViewModeProvider>
				</Spacer>
			</View>
		</Flex>
	);
}
