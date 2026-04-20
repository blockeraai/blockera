/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';
import type { Gradient } from '@wordpress/global-styles-engine';

/**
 * Internal dependencies
 */
import type { VariableType } from '../components/types';
import { GradientPresetOpener } from './gradient-preset-opener';
import { GradientPresetFields } from './gradient-preset-fields';
import {
	convertRepeaterValueToGradients,
	filterLinearGradients,
	filterRadialGradients,
} from './utils';
import {
	PresetGroup,
	getNewIndexFromPresets,
	ConfirmResetPresetDialog,
	getOriginResetDialogCopy,
	getOriginVariablesLabel,
	usePresetResetDialogState,
} from '../components';

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

	const { isResetDialogOpen, toggleResetDialog } =
		usePresetResetDialogState();

	const gradientKindPhrase = isLinear
		? __('linear gradient', 'blockera')
		: __('radial gradient', 'blockera');

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, gradientKindPhrase);

	const index = getNewIndexFromPresets(
		gradients.map((g) => ({ slug: g.slug })),
		`custom-`
	);

	const defaultPresetValue = {
		isVisible: true,
		gradient: isLinear
			? 'linear-gradient(90deg,#009efa 10%,#e52e00 90%)'
			: 'radial-gradient(rgb(0,159,251) 0%,rgb(229,46,0) 100%)',
		slug: `custom-${index}`,
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

	const presetFieldsPropsResolver = (
		item: VariableType,
		itemId: string | number,
		originArg: string | string[]
	) => ({
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
				<ConfirmResetPresetDialog
					text={resetDialogText}
					confirmButtonText={confirmButtonText}
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
				label={getOriginVariablesLabel(origin)}
				presetFieldsPropsResolver={presetFieldsPropsResolver}
			/>
		</>
	);
}
