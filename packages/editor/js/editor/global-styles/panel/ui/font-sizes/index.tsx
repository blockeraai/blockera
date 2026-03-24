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
import {
	createPortal,
	useState,
	useCallback,
	useMemo,
	memo,
} from '@wordpress/element';
import type { FontSize as FontSizeType } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { isEquals, pascalCase } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	PresetGroup,
	ScreenHeader,
	getNewIndexFromPresets,
	type PresetGroupPropsType,
	type PresetFieldsPropsResolver,
} from '../components';
import { FontSize } from './font-size';
import FontSizesScreen from './font-sizes-screen';
import { useGlobalSetting } from '../../context/hooks';
import { type VariableType } from '../components/types';
import { FontSizePresetOpener } from './font-size-preset-opener';
import { NavItemScreen } from '../../../../navigation/nav-item-screen';
import ConfirmResetFontSizesDialog from './confirm-reset-font-sizes-dialog';

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

type FontSizePresetGroup = {
	defaultPresetValue: DefaultPresetValue;
};

type FontSizePresetGroupProps = PresetGroupPropsType & FontSizePresetGroup;

const fontSizePresetFieldsPropsResolver: PresetFieldsPropsResolver = (
	item,
	itemId,
	origin,
	variables
) => ({
	sizes: variables,
	fontSize: item,
	origin,
	presetId: itemId,
});

function FontSizePresetGroup(props: FontSizePresetGroupProps) {
	return <PresetGroup {...props} />;
}

function FontSizeGroupComponent({
	sizes,
	origin,
	handleUpdateSizes,
	handleResetFontSizes,
}: FontSizeGroupProps) {
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);

	const resetDialogText =
		origin === 'custom'
			? __(
					'Are you sure you want to remove all custom font size presets?',
					'blockera'
				)
			: __(
					'Are you sure you want to reset all font size presets to their default values?',
					'blockera'
				);

	const index = useMemo(
		() => getNewIndexFromPresets(sizes, 'custom-'),
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
				<ConfirmResetFontSizesDialog
					text={resetDialogText}
					confirmButtonText={
						origin === 'custom'
							? __('Remove', 'blockera')
							: __('Reset', 'blockera')
					}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetFontSizes}
				/>
			)}
			<FontSizePresetGroup
				repeaterItemHeader={FontSizePresetOpener}
				onChange={handleChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={sizes}
				PresetFields={FontSize}
				title={__('Font Size', 'blockera')}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
				presetFieldsPropsResolver={fontSizePresetFieldsPropsResolver}
			/>
		</>
	);
}

const FontSizeGroup = memo(FontSizeGroupComponent);

function FontSizesPresetContent() {
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

	return (
		<VStack spacing={8}>
			{!!themeFontSizes?.length && (
				<FontSizeGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					sizes={themeFontSizes}
					handleUpdateSizes={handleUpdateThemeSizes}
					handleResetFontSizes={themeResetHandler}
				/>
			)}

			{defaultFontSizesEnabled && !!defaultFontSizes?.length && (
				<FontSizeGroup
					origin="default"
					label={__('Default', 'blockera')}
					sizes={defaultFontSizes}
					handleUpdateSizes={handleUpdateDefaultSizes}
					handleResetFontSizes={defaultResetHandler}
				/>
			)}

			<FontSizeGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				sizes={customFontSizes}
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
				title={__('Font size presets', 'blockera')}
				description={__(
					'Create and edit the presets used for font sizes across the site.',
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
