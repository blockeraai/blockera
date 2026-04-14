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
import { createPortal, useCallback, useMemo, memo } from '@wordpress/element';
import type { FontSize as FontSizeType } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
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
} from '../components';
import { FontSize } from './font-size';
import FontSizesScreen from './font-sizes-screen';
import { useGlobalSetting } from '../context/global-style-hooks';
import { type VariableType } from '../components/types';
import { FontSizePresetOpener } from './font-size-preset-opener';
import { NavItemScreen } from '../navigation/nav-item-screen';

const onBackFontSizes = () => {
	const parent = document.querySelector(
		'.blockera-font-size-presets-count-active'
	);
	if (parent && parent instanceof HTMLElement) {
		parent.classList.remove('blockera-font-size-presets-count-active');
		(parent.previousElementSibling as HTMLElement).style.removeProperty(
			'display'
		);
	}
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
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
	fluid: boolean | { min: string; max: string };
};

const fontSizePresetFieldsPropsResolver =
	createPresetFieldsPropsResolver('fontSize');

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
			).map((value) => ({
				slug: value.slug,
				name: value.name,
				size: value.size,
				fluid: value.fluid,
			})),
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

	const themeSizes = (themeFontSizes ?? []) as FontSizeType[];
	const defaultSizes = (defaultFontSizes ?? []) as FontSizeType[];
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
		<VStack spacing={8}>
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
				sizes={customFontSizes as FontSizeType[]}
				handleUpdateSizes={handleUpdateCustomSizes}
				handleResetFontSizes={customResetHandler}
			/>
		</VStack>
	);
}

function FontSizesEditorScreenShell() {
	return (
		<VStack spacing={2} className="blockera-font-size-presets">
			<ScreenHeader
				onBack={onBackFontSizes}
				title={__('Font size variables', 'blockera')}
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
	return createPortal(
		<Navigator initialPath="/">
			<NavItemScreen path="/">
				<FontSizesScreen />
			</NavItemScreen>
			<NavItemScreen path="/typography/font-sizes">
				<FontSizesEditorScreenShell />
			</NavItemScreen>
		</Navigator>,
		document.querySelector(screenSelector)
	);
}

export default FontSizes;
