/**
 * External dependencies
 */
import {
	__experimentalVStack as VStack,
	__experimentalSpacer as Spacer,
	__experimentalView as View,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import type { Color } from '@wordpress/global-styles-engine';
import { useState, useCallback, useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { pascalCase, isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	PresetGroup,
	ScreenHeader,
	getNewIndexFromPresets,
} from '../components';
import { useGetColors } from './use-get-colors';
import { convertRepeaterValueToColors } from './utils';
import { type VariableType } from '../components/types';
import { ColorPresetOpener } from './color-preset-opener';
import { ColorPresetFields } from './color-preset-fields';
import ConfirmResetColorsDialog from './confirm-reset-colors-dialog';

interface ColorPaletteScreenProps {
	onBackHandler: () => void;
}

interface ColorGroupProps {
	label: string;
	origin: string;
	colors: Color[];
	handleResetColors?: () => void;
	setThemeColors?: (colors: Color[]) => void;
	setDefaultColors?: (colors: Color[]) => void;
	setCustomColors?: (colors: Color[]) => void;
}

export type DefaultColorPresetValue = {
	slug: string;
	deletable: boolean;
	cloneable: boolean;
	visibilitySupport: boolean;
	color: string;
	type?: string;
};

const colorPresetFieldsPropsResolver = (
	item: VariableType & { color?: string; type?: string },
	itemId: string | number,
	origin: string | string[]
) => ({
	origin,
	colorItem: item,
	presetId: itemId,
});

function ColorGroupComponent({
	colors,
	origin,
	setThemeColors,
	setCustomColors,
	setDefaultColors,
	handleResetColors,
}: ColorGroupProps) {
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);

	const convertAndSetThemeColors = useCallback(
		(newValue: Object) =>
			setThemeColors(convertRepeaterValueToColors(newValue)),
		[setThemeColors]
	);

	const convertAndSetDefaultColors = useCallback(
		(newValue: Object) =>
			setDefaultColors(convertRepeaterValueToColors(newValue)),
		[setDefaultColors]
	);

	const convertAndSetCustomColors = useCallback(
		(newValue: Object) =>
			setCustomColors(convertRepeaterValueToColors(newValue)),
		[setCustomColors]
	);

	const resetDialogText =
		origin === 'custom'
			? __(
					'Are you sure you want to remove all custom color presets?',
					'blockera'
				)
			: __(
					'Are you sure you want to reset all color presets to their default values?',
					'blockera'
				);

	const index = useMemo(
		() =>
			getNewIndexFromPresets(
				colors.map((c) => ({ slug: c.slug })),
				'custom-'
			),
		[colors]
	);

	const defaultPresetValue = useMemo(
		() => ({
			color: '#000000',
			slug: `custom-${index}`,
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

	const addVariableModalConfig = useMemo(
		() => ({
			headerTitle: __('Add Color', 'blockera'),
			description: __(
				'Name your new color preset. The ID will be generated from the name and used in your styles.',
				'blockera'
			),
			duplicateSlugMessage: __(
				'This ID is already used by another color preset.',
				'blockera'
			),
			controlNamePrefix: 'add-color',
		}),
		[]
	);

	const controlName = `color-presets-${origin}`;

	const onChange = useCallback(
		(newValue: Object) => {
			if ('theme' === origin) {
				convertAndSetThemeColors(newValue);
			} else if ('default' === origin) {
				convertAndSetDefaultColors(newValue);
			} else if ('custom' === origin) {
				convertAndSetCustomColors(newValue);
			}
		},
		[setThemeColors, setDefaultColors, setCustomColors]
	);

	return (
		<>
			{handleResetColors && isResetDialogOpen && (
				<ConfirmResetColorsDialog
					text={resetDialogText}
					confirmButtonText={
						origin === 'custom'
							? __('Remove', 'blockera')
							: __('Reset', 'blockera')
					}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetColors}
				/>
			)}
			<PresetGroup
				repeaterItemHeader={ColorPresetOpener}
				onChange={onChange}
				controlName={controlName}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={colors}
				PresetFields={ColorPresetFields}
				title={__('Color', 'blockera')}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
				addVariableModalConfig={addVariableModalConfig}
				presetFieldsPropsResolver={colorPresetFieldsPropsResolver}
			/>
		</>
	);
}

const ColorGroup = memo(ColorGroupComponent);

function ColorPalettePresetContent() {
	const {
		themeColors,
		customColors,
		defaultColors,
		setThemeColors,
		baseThemeColors,
		setCustomColors,
		setDefaultColors,
		baseDefaultColors,
		defaultPaletteEnabled,
	} = useGetColors();

	const baseTheme = useMemo(() => baseThemeColors ?? [], [baseThemeColors]);
	const safeThemeColors = useMemo(() => themeColors ?? [], [themeColors]);
	const baseDefault = useMemo(
		() => baseDefaultColors ?? [],
		[baseDefaultColors]
	);
	const safeDefaultColors = useMemo(
		() => defaultColors ?? [],
		[defaultColors]
	);

	const resetThemeToBase = useCallback(() => {
		setThemeColors(baseTheme);
	}, [setThemeColors, baseTheme]);

	const resetDefaultToBase = useCallback(() => {
		setDefaultColors(baseDefault);
	}, [setDefaultColors, baseDefault]);

	const clearCustomColors = useCallback(() => {
		setCustomColors([]);
	}, [setCustomColors]);

	const themeResetHandler = useMemo(() => {
		if (!isEquals(safeThemeColors, baseTheme)) {
			return resetThemeToBase;
		}
		return undefined;
	}, [safeThemeColors, baseTheme, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!isEquals(safeDefaultColors, baseDefault)) {
			return resetDefaultToBase;
		}
		return undefined;
	}, [safeDefaultColors, baseDefault, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customColors.length > 0 ? clearCustomColors : undefined),
		[customColors.length, clearCustomColors]
	);

	return (
		<VStack spacing={8} className="global-styles-ui-color-palette-panel">
			{!!safeThemeColors.length && (
				<ColorGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					colors={safeThemeColors}
					setThemeColors={setThemeColors}
					handleResetColors={themeResetHandler}
				/>
			)}

			{!!safeDefaultColors.length && !!defaultPaletteEnabled && (
				<ColorGroup
					origin="default"
					label={__('Default', 'blockera')}
					colors={safeDefaultColors}
					setDefaultColors={setDefaultColors}
					handleResetColors={defaultResetHandler}
				/>
			)}

			<ColorGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				colors={customColors}
				setCustomColors={setCustomColors}
				handleResetColors={customResetHandler}
			/>
		</VStack>
	);
}

function ColorPaletteScreen({ onBackHandler }: ColorPaletteScreenProps) {
	return (
		<VStack spacing={2} className="blockera-color-palette-presets">
			<ScreenHeader
				onBack={onBackHandler}
				title={__('Color palette', 'blockera')}
				description={__(
					'Manage and create color variables for use across the site.',
					'blockera'
				)}
			/>

			<View>
				<Spacer paddingX={4}>
					<ColorPalettePresetContent />
				</Spacer>
			</View>
		</VStack>
	);
}

export default ColorPaletteScreen;
