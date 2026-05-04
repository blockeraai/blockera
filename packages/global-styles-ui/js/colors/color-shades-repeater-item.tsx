/**
 * External dependencies
 */
import { memo, useContext, useMemo } from '@wordpress/element';
import type { ComponentType } from 'react';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import {
	RepeaterItem,
	RepeaterContext,
	ColorIndicatorStack,
} from '@blockera/controls';
import { componentInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { VariableType } from '../components/types';
import {
	filterVariationsByBase,
	getDisplayShadeRamp,
	stackValueFromShades,
	variationsToStackMap,
} from './color-palette-variations-utils';
import {
	COLOR_SHADE_ANCHOR_STEP,
	COLOR_SHADE_STEPS,
} from './color-shades-generator';
import { useColorPaletteVariationsStorage } from './color-palette-variations-context';
import { findRepeaterItemIdBySlug, parsePaletteShadeSlug } from './utils';

/** Main preset row used to build the display ramp (synthetic 500 + stored shades). */
export type ColorPresetShadeStackMainPreset = {
	slug: string;
	name: string;
	color?: string;
};

/**
 * Stack value for {@link ColorIndicatorStack} — full ramp from storage + anchor color.
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
	const ramp = getDisplayShadeRamp(fullPalette, baseSlug, mainPreset);
	return stackValueFromShades(variationsToStackMap(ramp));
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
	children?: React.ReactNode;
}) {
	const { fullPalette } = useColorPaletteVariationsStorage();
	const stackValue = useMemo(
		() =>
			buildColorPresetShadeStackValue(fullPalette, baseSlug, mainPreset),
		[
			fullPalette,
			baseSlug,
			mainPreset.slug,
			mainPreset.name,
			mainPreset.color,
		]
	);

	if (!stackValue?.length) {
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
				maxItems={COLOR_SHADE_STEPS.length}
			/>
			{children}
		</span>
	);
}

export const ColorPresetShadeStackHeader = memo(
	ColorPresetShadeStackHeaderComponent
);

function ColorShadesRepeaterItemComponent({
	item,
	itemId: parentRepeaterItemId,
}: {
	item: VariableType | Record<string, unknown>;
	itemId: string;
}) {
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

	const colorItem = item as VariableType & { color?: string };
	const { fullPalette } = useColorPaletteVariationsStorage();

	/** Parent row slug (base); nested shade rows receive `baseSlug` in preset fields. */
	const parentSlug = String(colorItem.slug ?? '');
	const mainPreset = {
		slug: parentSlug,
		name: String(colorItem.name ?? ''),
		color: colorItem.color,
	};
	const storedForBase = filterVariationsByBase(fullPalette, parentSlug);
	const showStack = storedForBase.length > 0;

	if (!showStack) {
		return null;
	}

	const forBase = getDisplayShadeRamp(fullPalette, parentSlug, mainPreset);

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
		const merged = {
			...item,
			...variation,
			baseSlug: parentSlug,
			renderRepeaterItem: true,
		};
		const rowItem = { ...merged };
		if (storeRow && typeof storeRow === 'object') {
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

export const ColorShadesRepeaterItem: ComponentType<{
	item: VariableType | Record<string, unknown>;
	itemId: string;
}> = memo(ColorShadesRepeaterItemComponent);
