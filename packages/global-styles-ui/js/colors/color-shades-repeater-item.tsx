/**
 * External dependencies
 */
import type { ComponentType, ReactNode } from 'react';
import { memo, useContext, useMemo } from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import {
	RepeaterItem,
	RepeaterContext,
	ColorIndicatorStack,
	normalizeVariablePickerSearchQuery,
	usePresetVariablesViewMode,
	useVarPickerPresetContext,
	useVariablePickerSearchQuery,
} from '@blockera/controls';
import { componentInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { VariableType } from '../components/types';
import {
	filterVariationsByBase,
	getDisplayShadeRamp,
	getDisplayShadeRampWithStackMap,
} from './color-palette-variations-utils';
import { COLOR_SHADE_ANCHOR_STEP } from './color-shades-generator';
import { usePresetVariationsStorage } from '../context/preset-variations-context';
import { resolvePresetTaxonomyEditName } from '../components/preset-taxonomy/taxonomy-meta';
import { variablePickerRowMatchesSelected } from '../components/variable-picker-preset-utils';
import { findRepeaterItemIdBySlug, parsePaletteShadeSlug } from './utils';
import './style.scss';

/** Compact header/category stack preview — every other step from the full ramp. */
const COLOR_PRESET_SHADE_STACK_PREVIEW_STEPS = [
	100, 300, 500, 700, 900,
] as const;

/** Main preset row used to build the display ramp (synthetic 500 + stored shades). */
export type ColorPresetShadeStackMainPreset = {
	slug: string;
	name: string;
	color?: string;
	/** Variable-picker paint type for resolving theme tokens before shade math. */
	type?: string;
};

/**
 * Stack value for compact color ramp previews (100/300/500/700/900).
 * Returns `null` when the base has no persisted shade variations.
 */
export function buildColorPresetShadeStackValue(
	fullPalette: Color[],
	baseSlug: string,
	mainPreset: ColorPresetShadeStackMainPreset
): Array<{ value: string; type: 'color' }> | null {
	if (filterVariationsByBase(fullPalette, baseSlug).length === 0) {
		return null;
	}
	const { stackMap } = getDisplayShadeRampWithStackMap(
		fullPalette,
		baseSlug,
		mainPreset
	);
	return COLOR_PRESET_SHADE_STACK_PREVIEW_STEPS.map((step) => ({
		value: stackMap?.[String(step)] ?? '',
		type: 'color' as const,
	}));
}

function ColorPresetShadeStackHeaderComponent({
	baseSlug,
	mainPreset,
	size = 18,
	children,
}: {
	baseSlug: string;
	mainPreset: ColorPresetShadeStackMainPreset;
	size?: number;
	children?: ReactNode;
}) {
	const { fullItems } = usePresetVariationsStorage<Color>();
	// ColorIndicatorStack reverses `value` for display; reverse here so LTR stays light→dark.
	const stackValue = useMemo(() => {
		const value = buildColorPresetShadeStackValue(
			fullItems,
			baseSlug,
			mainPreset
		);
		return value ? [...value].reverse() : null;
	}, [fullItems, baseSlug, mainPreset]);

	if (!stackValue) {
		return null;
	}

	return (
		<span
			className={componentInnerClassNames('header-shade-stack')}
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				flexShrink: 0,
			}}
			data-cy="color-preset-shade-stack"
		>
			<ColorIndicatorStack
				value={stackValue}
				size={size}
				maxItems={COLOR_PRESET_SHADE_STACK_PREVIEW_STEPS.length}
				displayMode="centered"
				space={-7}
			/>
			{children}
		</span>
	);
}

export const ColorPresetShadeStackHeader = memo(
	ColorPresetShadeStackHeaderComponent
);

export type ColorShadesRepeaterItemComponentProps = {
	itemId: string;
	item: VariableType | Record<string, unknown>;
	/**
	 * When false, nested shade rows ignore `selectable` / `isSelected` from the repeater store
	 * (e.g. inline picker strip in the preset header — selection stays on the parent row / accordion body).
	 */
	inheritRepeaterPickerSelection?: boolean;
};
function ColorShadesRepeaterItemComponent({
	item,
	itemId: parentRepeaterItemId,
	inheritRepeaterPickerSelection = true,
}: ColorShadesRepeaterItemComponentProps) {
	const pickerCtx = useVarPickerPresetContext();
	const variablePickerSearchQuery = useVariablePickerSearchQuery();
	const { viewMode } = usePresetVariablesViewMode();
	const useListViewShadeStepLabel =
		pickerCtx.active === true &&
		pickerCtx.variableType === 'color' &&
		viewMode === 'list' &&
		normalizeVariablePickerSearchQuery(variablePickerSearchQuery) === '';

	const { repeaterItems } = useContext(RepeaterContext) as {
		repeaterItems?: Record<
			string,
			{
				slug?: string;
				isSelected?: boolean;
				selectable?: boolean;
			} & Record<string, unknown>
		>;
	};

	const colorItem = item as VariableType & {
		color?: string;
		type?: string;
	};
	const { fullItems, taxonomyNameSource } =
		usePresetVariationsStorage<Color>();

	/** Parent row slug (base); nested shade rows receive `baseSlug` in preset fields. */
	const parentSlug = String(colorItem.slug ?? '');
	const parentFullName = resolvePresetTaxonomyEditName(
		colorItem as Record<string, unknown>,
		taxonomyNameSource
	);
	const mainPreset: ColorPresetShadeStackMainPreset = {
		slug: parentSlug,
		name:
			parentFullName !== ''
				? parentFullName
				: String(colorItem.name ?? ''),
		color: colorItem.color,
		type: typeof colorItem.type === 'string' ? colorItem.type : undefined,
	};
	const storedForBase = filterVariationsByBase(fullItems, parentSlug);
	const showStack = storedForBase.length > 0;

	if (!showStack) {
		return null;
	}

	const forBase = getDisplayShadeRamp(fullItems, parentSlug, mainPreset);

	return forBase.map((variation) => {
		const variationSlug = String(variation.slug ?? '');
		const shadeMeta = parsePaletteShadeSlug(variationSlug);
		let resolvedItemId =
			shadeMeta &&
			String(shadeMeta.shadeStep) === String(COLOR_SHADE_ANCHOR_STEP)
				? findRepeaterItemIdBySlug(repeaterItems, parentSlug)
				: findRepeaterItemIdBySlug(repeaterItems, variationSlug);

		if (
			resolvedItemId === null &&
			shadeMeta &&
			String(shadeMeta.shadeStep) === String(COLOR_SHADE_ANCHOR_STEP)
		) {
			resolvedItemId = parentRepeaterItemId;
		}

		if (resolvedItemId === null) {
			return null;
		}

		const storeKey = String(resolvedItemId);
		const storeRow = repeaterItems?.[storeKey];
		const shadeStepLabel =
			shadeMeta !== null
				? shadeMeta.shadeStep
				: String(variation.name ?? '');

		// Persisted and display names are the step (e.g. "200"); list view always prefers slug step.
		const variationName = useListViewShadeStepLabel
			? shadeStepLabel
			: String(variation.name ?? '');

		const merged = {
			...item,
			...variation,
			display: true,
			baseSlug: parentSlug,
			renderRepeaterItem: true,
			name: variationName,
		};
		const rowItem = { ...merged };
		if (
			inheritRepeaterPickerSelection &&
			storeRow &&
			typeof storeRow === 'object'
		) {
			if ('isSelected' in storeRow) {
				Object.assign(rowItem, {
					isSelected: storeRow.isSelected,
				});
			}
			if ('selectable' in storeRow) {
				Object.assign(rowItem, {
					selectable: storeRow.selectable,
				});
			}
		}
		if (!inheritRepeaterPickerSelection) {
			Object.assign(rowItem as Record<string, unknown>, {
				selectable: false,
				isSelected: false,
			});
		}

		const isColorVariablePickerStrip =
			pickerCtx.active === true && pickerCtx.variableType === 'color';
		if (isColorVariablePickerStrip) {
			const controlProps =
				pickerCtx.controlPropsRef?.current ?? pickerCtx.controlProps;
			const pickerValue = controlProps?.value;
			const shadeRowForSelection = {
				...(rowItem as Record<string, unknown>),
				slug: variationSlug,
				id: variationSlug,
			};
			Object.assign(rowItem as Record<string, unknown>, {
				selectable: true,
				suppressPresetHeaderSettings: true,
				isSelected: variablePickerRowMatchesSelected(
					shadeRowForSelection,
					'color',
					'theme',
					pickerValue
				),
			});
		}

		return (
			<RepeaterItem
				key={variation.slug}
				{...{
					item: rowItem,
					itemId: resolvedItemId,
					showVariations: false,
				}}
			/>
		);
	});
}

export const ColorShadesRepeaterItem: ComponentType<ColorShadesRepeaterItemComponentProps> =
	memo(ColorShadesRepeaterItemComponent);
