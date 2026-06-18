/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	Navigator,
	__experimentalView as View,
	__experimentalVStack as VStack,
	__experimentalSpacer as Spacer,
} from '@wordpress/components';
import { memo, useMemo, useCallback, createPortal } from '@wordpress/element';
import type { FontSize as FontSizeType } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { normalizeFontSizeThemeJsonPreset } from '@blockera/data';
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
	withPresetMetaFromRepeaterRow,
} from '../components';
import { FontSize } from './font-size';
import FontSizesScreen from './font-sizes-screen';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { FontSizePresetOpener } from './font-size-preset-opener';
import { NavItemScreen } from '../navigation/nav-item-screen';
import {
	useOverrideNavigator,
	BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS,
	disablePresetInspectorCleanup,
	enablePresetInspectorCleanup,
} from '../panel-override';

const onBack = () => {
	disablePresetInspectorCleanup(
		BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS
	);
};

const onClick = (event: Event) => {
	enablePresetInspectorCleanup(
		BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS,
		event
	);
};

interface FontSizeGroupProps {
	label: string;
	origin: string;
	sizes: FontSizeType[];
	handleResetFontSizes?: () => void;
	handleUpdateSizes?: (newValue: Object) => void;
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
	origin,
	handleUpdateSizes,
	handleResetFontSizes,
}: FontSizeGroupProps) {
	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

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
			{handleResetFontSizes && isResetDialogOpen && (
				<ConfirmResetPresetDialog
					text={resetDialogText}
					confirmButtonText={confirmButtonText}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetFontSizes}
				/>
			)}
			<PresetGroup
				repeaterItemHeader={FontSizePresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={FontSize}
				title={__('Font Size', 'blockera')}
				label={getOriginVariablesLabel(origin)}
				presetFieldsPropsResolver={fontSizePresetFieldsPropsResolver}
			/>
		</>
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

	const handleUpdateCustomSizes = useCallback(
		(newValue: Object) => {
			setCustomFontSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setCustomFontSizes]
	);

	const handleUpdateThemeSizes = useCallback(
		(newValue: Object) => {
			setThemeFontSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setThemeFontSizes]
	);

	const handleUpdateDefaultSizes = useCallback(
		(newValue: Object) => {
			setDefaultFontSizes(convertRepeaterValueToArray(newValue));
		},
		[convertRepeaterValueToArray, setDefaultFontSizes]
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

	return (
		<VStack className="blockera-font-size-editor-groups" spacing={8}>
			{showThemeOriginGroup && (
				<FontSizeGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themeSizes}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetFontSizes={themeResetHandler}
				/>
			)}

			{showDefaultOriginGroup && (
				<FontSizeGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultSizes}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetFontSizes={defaultResetHandler}
				/>
			)}

			<FontSizeGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customSizesForUi}
				handleUpdateSizes={handleUpdateCustomSizes}
				handleResetFontSizes={customResetHandler}
			/>
		</VStack>
	);
}

function FontSizesEditorScreenShell() {
	return (
		<VStack
			spacing={2}
			className="blockera-font-size-editor"
			style={{ paddingBottom: '10px' }}
		>
			<ScreenHeader
				onBack={onBack}
				title={__('Font Size Variables', 'blockera')}
				description={__(
					'Create and edit font size variables used for typography across the site.',
					'blockera'
				)}
			/>

			<View>
				<Spacer paddingX={4}>
					<FontSizesPresetContent />
				</Spacer>
			</View>
		</VStack>
	);
}

function FontSizes({ screenSelector }: { screenSelector: string }) {
	useOverrideNavigator({ panel: 'typography' });

	const target = document.querySelector(screenSelector);

	if (!target) {
		return null;
	}

	return createPortal(
		<div className="blockera-block-inspector-controls-wrapper">
			<Navigator initialPath="/">
				<NavItemScreen path="/">
					<FontSizesScreen onClick={onClick} />
				</NavItemScreen>
				<NavItemScreen path="/typography/font-sizes">
					<FontSizesEditorScreenShell />
				</NavItemScreen>
			</Navigator>
		</div>,
		target
	);
}

export default FontSizes;
