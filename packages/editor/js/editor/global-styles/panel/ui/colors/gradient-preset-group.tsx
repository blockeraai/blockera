/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useState, useCallback } from '@wordpress/element';
import type { Gradient } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { pascalCase } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { PresetGroup, getNewIndexFromPresets } from '../components';
import type { VariableType, VariablesType } from '../components/types';
import { GradientPresetOpener } from './gradient-preset-opener';
import { GradientPresetFields } from './gradient-preset-fields';
import {
	convertRepeaterValueToGradients,
	filterLinearGradients,
	filterRadialGradients,
} from './utils';
import ConfirmResetColorsDialog from './confirm-reset-colors-dialog';

export type GradientPresetVariant = 'linear' | 'radial';

interface GradientPresetGroupProps {
	variant: GradientPresetVariant;
	origin: string;
	gradients: Gradient[];
	themeGradients: Gradient[] | undefined;
	defaultGradients: Gradient[] | undefined;
	customGradients: Gradient[];
	setThemeGradients: (g: Gradient[]) => void;
	setDefaultGradients: (g: Gradient[]) => void;
	setCustomGradients: (g: Gradient[]) => void;
	handleResetGradients?: () => void;
}

function mergeWithOppositeKind(
	variant: GradientPresetVariant,
	origin: 'theme' | 'default' | 'custom',
	newGradients: Gradient[],
	themeGradients: Gradient[] | undefined,
	defaultGradients: Gradient[] | undefined,
	customGradients: Gradient[],
	setThemeGradients: (g: Gradient[]) => void,
	setDefaultGradients: (g: Gradient[]) => void,
	setCustomGradients: (g: Gradient[]) => void
) {
	const fallbackThemeGradient =
		origin === 'default' ? defaultGradients : customGradients;
	const full = origin === 'theme' ? themeGradients : fallbackThemeGradient;

	const merged = (
		variant === 'linear'
			? [...newGradients, ...filterRadialGradients(full)]
			: [...filterLinearGradients(full), ...newGradients]
	) as Gradient[];

	if (origin === 'theme') {
		setThemeGradients(merged);
	} else if (origin === 'default') {
		setDefaultGradients(merged);
	} else {
		setCustomGradients(merged);
	}
}

export function GradientPresetGroup({
	variant,
	origin,
	gradients,
	themeGradients,
	defaultGradients,
	customGradients,
	setThemeGradients,
	setDefaultGradients,
	setCustomGradients,
	handleResetGradients,
}: GradientPresetGroupProps) {
	const isLinear = variant === 'linear';
	const gradientType = isLinear ? 'linear-gradient' : 'radial-gradient';
	const slugKind = isLinear ? 'linear' : 'radial';

	const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
	const toggleResetDialog = () => setIsResetDialogOpen(!isResetDialogOpen);

	const dialogForReset = isLinear
		? __(
				'Are you sure you want to reset all linear gradient presets to their default values?',
				'blockera'
			)
		: __(
				'Are you sure you want to reset all radial gradient presets to their default values?',
				'blockera'
			);
	const dialogForRemove = isLinear
		? __(
				'Are you sure you want to remove all custom linear gradient presets?',
				'blockera'
			)
		: __(
				'Are you sure you want to remove all custom radial gradient presets?',
				'blockera'
			);
	const resetDialogText =
		origin === 'custom' ? dialogForRemove : dialogForReset;

	const index = getNewIndexFromPresets(
		gradients.map((g) => ({ slug: g.slug })),
		`custom-${slugKind}-`
	);

	const defaultPresetValue = {
		gradient: isLinear
			? 'linear-gradient(90deg,#009efa 10%,#e52e00 90%)'
			: 'radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)',
		slug: `custom-${slugKind}-${index}`,
		deletable: origin === 'custom',
		cloneable: origin === 'custom',
		visibilitySupport: origin === 'custom',
		name: (isLinear
			? sprintf(
					/* translators: %d: gradient index */
					__('Linear Gradient %d', 'blockera'),
					index
				)
			: sprintf(
					/* translators: %d: gradient index */
					__('Radial Gradient %d', 'blockera'),
					index
				)) as string,
	};

	const addVariableModalConfig = {
		headerTitle: isLinear
			? __('Add Linear Gradient', 'blockera')
			: __('Add Radial Gradient', 'blockera'),
		description: isLinear
			? __(
					'Name your new linear gradient preset. The ID will be generated from the name and used in your styles.',
					'blockera'
				)
			: __(
					'Name your new radial gradient preset. The ID will be generated from the name and used in your styles.',
					'blockera'
				),
		duplicateSlugMessage: isLinear
			? __(
					'This ID is already used by another linear gradient preset.',
					'blockera'
				)
			: __(
					'This ID is already used by another radial gradient preset.',
					'blockera'
				),
		controlNamePrefix: isLinear
			? 'add-linear-gradient'
			: 'add-radial-gradient',
	};

	const presetFieldsPropsResolver = (
		item: VariableType,
		itemId: string | number,
		originArg: string | string[],
		variables: VariablesType
	) => ({
		gradients: variables,
		gradientItem: item,
		origin: originArg,
		presetId: itemId,
		gradientType: gradientType as 'linear-gradient' | 'radial-gradient',
	});

	const handleUpdate = useCallback(
		(newValue: object) => {
			const newGradients = convertRepeaterValueToGradients(newValue);
			mergeWithOppositeKind(
				variant,
				origin as 'theme' | 'default' | 'custom',
				newGradients,
				themeGradients,
				defaultGradients,
				customGradients,
				setThemeGradients,
				setDefaultGradients,
				setCustomGradients
			);
		},
		[
			variant,
			origin,
			themeGradients,
			defaultGradients,
			customGradients,
			setThemeGradients,
			setDefaultGradients,
			setCustomGradients,
		]
	);

	return (
		<>
			{handleResetGradients && isResetDialogOpen && (
				<ConfirmResetColorsDialog
					text={resetDialogText}
					confirmButtonText={
						origin === 'custom'
							? __('Remove', 'blockera')
							: __('Reset', 'blockera')
					}
					isOpen={isResetDialogOpen}
					toggleOpen={toggleResetDialog}
					onConfirm={handleResetGradients}
				/>
			)}
			<PresetGroup
				repeaterItemHeader={GradientPresetOpener}
				onChange={handleUpdate}
				controlName={`${slugKind}-gradient-presets-${origin}`}
				defaultPresetValue={defaultPresetValue}
				origin={origin}
				variables={gradients}
				PresetFields={GradientPresetFields}
				title={
					isLinear
						? __('Linear Gradient', 'blockera')
						: __('Radial Gradient', 'blockera')
				}
				label={sprintf(
					/* translators: %s: Origin name (Theme, Default, or Custom) */
					__('%s Variables', 'blockera'),
					pascalCase(origin)
				)}
				addVariableModalConfig={addVariableModalConfig}
				presetFieldsPropsResolver={presetFieldsPropsResolver}
			/>
		</>
	);
}
