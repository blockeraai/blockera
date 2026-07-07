/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';
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
	PresetTaxonomyGroupLayout,
	getNewIndexFromPresets,
	getOriginResetDialogCopy,
	getOriginVariablesLabel,
} from '../components';

export type GradientPresetVariant = 'linear' | 'radial';

interface GradientPresetGroupProps {
	variant: GradientPresetVariant;
	origin: string;
	gradients: Gradient[];
	baseGradients?: Gradient[];
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
	baseGradients,
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

	const gradientKindPhrase = isLinear
		? __('linear gradient', 'blockera')
		: __('radial gradient', 'blockera');

	const { dialogText: resetDialogText, confirmButtonText } =
		getOriginResetDialogCopy(origin, gradientKindPhrase);

	const index = useMemo(
		() =>
			getNewIndexFromPresets(
				gradients.map((g) => ({ slug: g.slug })),
				`custom-`
			),
		[gradients]
	);

	const defaultPresetValue = useMemo(
		() => ({
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
		}),
		[index, origin, isLinear]
	);

	const presetFieldsPropsResolver = useCallback(
		(
			item: VariableType,
			itemId: string | number,
			originArg: string | string[]
		) => ({
			gradientItem: item,
			origin: originArg,
			presetId: itemId,
			gradientType: gradientType as 'linear-gradient' | 'radial-gradient',
		}),
		[gradientType]
	);

	const convertRepeaterToItems = useCallback(
		(newValue: object) => convertRepeaterValueToGradients(newValue),
		[]
	);

	const onPersistItems = useCallback(
		(next: Gradient[]) => {
			mergeWithOppositeKind(
				variant,
				origin as 'theme' | 'default' | 'custom',
				next,
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
		<PresetTaxonomyGroupLayout<Gradient & Record<string, unknown>>
			origin={origin}
			items={gradients}
			baseItems={baseGradients}
			controlName={`${slugKind}-gradient-presets-${origin}`}
			convertRepeaterToItems={convertRepeaterToItems}
			onPersistItems={onPersistItems}
			PresetFields={GradientPresetFields}
			repeaterItemHeader={GradientPresetOpener}
			presetFieldsPropsResolver={presetFieldsPropsResolver}
			defaultPresetValue={defaultPresetValue}
			title={
				isLinear
					? __('Linear Gradient', 'blockera')
					: __('Radial Gradient', 'blockera')
			}
			label={getOriginVariablesLabel(origin)}
			handleReset={handleResetGradients}
			resetDialogText={resetDialogText}
			resetConfirmButtonText={confirmButtonText}
		/>
	);
}
