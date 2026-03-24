/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	__experimentalVStack as VStack,
	__experimentalSpacer as Spacer,
	__experimentalView as View,
} from '@wordpress/components';
import type { Color } from '@wordpress/global-styles-engine';
import { useState, useCallback, useMemo, memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { pascalCase } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	PresetGroup,
	ScreenHeader,
	getNewIndexFromPresets,
} from '../components';
import { ColorPresetOpener } from './color-preset-opener';
import { ColorPresetFields } from './color-preset-fields';
import type { VariableType, VariablesType } from '../components/types';
import ConfirmResetColorsDialog from './confirm-reset-colors-dialog';
import { useGetColors } from './use-get-colors';
import {
	areColorPresetListsEqual,
	convertRepeaterValueToColors,
} from './utils';

interface ColorPaletteScreenProps {
	onBackHandler: () => void;
}

interface ColorGroupProps {
	label: string;
	origin: string;
	colors: Color[];
	handleResetColors?: () => void;
	handleUpdateColors?: (newValue: Object) => void;
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
	origin: string | string[],
	variables: VariablesType
) => ({
	origin,
	colorItem: item,
	colors: variables,
	presetId: itemId,
});

function colorGroupPropsAreEqual(
	prev: ColorGroupProps,
	next: ColorGroupProps
): boolean {
	if (prev.origin !== next.origin) {
		return false;
	}
	if (prev.handleUpdateColors !== next.handleUpdateColors) {
		return false;
	}
	if (prev.handleResetColors !== next.handleResetColors) {
		return false;
	}
	return areColorPresetListsEqual(prev.colors, next.colors);
}

function ColorGroupComponent({
	colors,
	origin,
	handleUpdateColors,
	handleResetColors,
}: ColorGroupProps) {
	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

	const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);

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

	const defaultPresetValue = {
		color: '#000000',
		type: 'color',
		slug: `custom-${index}`,
		deletable: origin === 'custom',
		cloneable: origin === 'custom',
		visibilitySupport: origin === 'custom',
		name: sprintf(
			/* translators: %d: color index */
			__('Color %d', 'blockera'),
			index
		) as string,
	};

	const addVariableModalConfig = {
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
	};

	const controlName = `color-presets-${origin}`;

	const onChange = useCallback(
		(newValue: Object) => {
			if (handleUpdateColors) {
				handleUpdateColors(newValue);
			}
		},
		[handleUpdateColors]
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
				variables={colors.map((c) => ({
					...c,
					type: (c as { type?: string }).type || 'color',
				}))}
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

const ColorGroup = memo(ColorGroupComponent, colorGroupPropsAreEqual);

/**
 * Subscribes to global color palette settings.
 *
 * Why you still see re-renders while debugging:
 * - `useGlobalSetting` reads `useGlobalStylesContext()`. Any global-styles edit
 *   produces a new merged `user` config, so this component re-renders.
 * - `ColorGroup` is memoized with a deep equality check on `colors`, so sibling
 *   groups (theme vs custom) can skip React work when their palette data is
 *   unchanged. PresetGroup also uses stable Inserter/Promo callbacks and a memoized
 *   repeater context value to avoid churn inside RepeaterControl.
 */
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

	const convertAndSetThemeColors = useCallback(
		(newValue: Object) => {
			const colors = convertRepeaterValueToColors(newValue);
			setThemeColors(colors);
		},
		[setThemeColors]
	);

	const convertAndSetDefaultColors = useCallback(
		(newValue: Object) => {
			const colors = convertRepeaterValueToColors(newValue);
			setDefaultColors(colors);
		},
		[setDefaultColors]
	);

	const convertAndSetCustomColors = useCallback(
		(newValue: Object) => {
			const items = Object.values(newValue as Record<string, any>);
			const colors: Color[] = items
				.filter(
					(v) =>
						v.type === 'color' ||
						!v.type ||
						(v.color && /^#|^rgb|^rgba/.test(String(v.color)))
				)
				.map((v) => ({
					slug: v.slug,
					name: v.name,
					color: v.color || '',
				}));
			setCustomColors(colors);
		},
		[setCustomColors]
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
		if (!areColorPresetListsEqual(safeThemeColors, baseTheme)) {
			return resetThemeToBase;
		}
		return undefined;
	}, [safeThemeColors, baseTheme, resetThemeToBase]);

	const defaultResetHandler = useMemo(() => {
		if (!areColorPresetListsEqual(safeDefaultColors, baseDefault)) {
			return resetDefaultToBase;
		}
		return undefined;
	}, [safeDefaultColors, baseDefault, resetDefaultToBase]);

	const customResetHandler = useMemo(
		() => (customColors.length > 0 ? clearCustomColors : undefined),
		[customColors.length, clearCustomColors]
	);

	const customColorsForRepeater = useMemo(
		() =>
			customColors.map((c) => ({
				...c,
				type: 'color' as const,
			})),
		[customColors]
	);

	return (
		<VStack spacing={8} className="global-styles-ui-color-palette-panel">
			{!!safeThemeColors.length && (
				<ColorGroup
					origin="theme"
					label={__('Theme', 'blockera')}
					colors={safeThemeColors}
					handleUpdateColors={convertAndSetThemeColors}
					handleResetColors={themeResetHandler}
				/>
			)}

			{!!safeDefaultColors.length && !!defaultPaletteEnabled && (
				<ColorGroup
					origin="default"
					label={__('Default', 'blockera')}
					colors={safeDefaultColors}
					handleUpdateColors={convertAndSetDefaultColors}
					handleResetColors={defaultResetHandler}
				/>
			)}

			<ColorGroup
				origin="custom"
				label={__('Custom', 'blockera')}
				colors={customColorsForRepeater}
				handleUpdateColors={convertAndSetCustomColors}
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
					'The combination of colors used across the site and in color pickers. Preserves the default WordPress palette.',
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
