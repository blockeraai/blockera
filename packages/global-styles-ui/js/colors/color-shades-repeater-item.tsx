/**
 * External dependencies
 */
import type { ComponentType, CSSProperties, ReactNode } from 'react';
import { memo, useContext, useMemo } from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import {
	RepeaterItem,
	RepeaterContext,
	ColorIndicator,
} from '@blockera/controls';
import {
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';

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
	generateColorShades,
} from './color-shades-generator';
import { useColorPaletteVariationsStorage } from './color-palette-variations-context';
import {
	findRepeaterItemIdBySlug,
	parsePaletteShadeSlug,
	shadeHexDiffersFromBaseline,
} from './utils';
import './style.scss';

/** Main preset row used to build the display ramp (synthetic 500 + stored shades). */
export type ColorPresetShadeStackMainPreset = {
	slug: string;
	name: string;
	color?: string;
};

/**
 * Stack value for color ramp previews — full ramp from storage + anchor color.
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

function colorIndicatorStackMarginSpace(count: number): string {
	if (count <= 1) {
		return '0';
	}
	if (count <= 2) {
		return '-3px';
	}
	if (count < 4) {
		return '-5px';
	}
	if (count < 6) {
		return '-7px';
	}
	if (count <= 11) {
		return '-9px';
	}
	return '-10px';
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
	const { fullPalette } = useColorPaletteVariationsStorage();
	const stackRender = useMemo(() => {
		if (filterVariationsByBase(fullPalette, baseSlug).length === 0) {
			return null;
		}
		const ramp = getDisplayShadeRamp(fullPalette, baseSlug, mainPreset);
		const hexByStep = variationsToStackMap(ramp);
		const baselineHexByStep = generateColorShades(
			mainPreset.color ?? '#000000'
		);
		return { hexByStep, baselineHexByStep, steps: COLOR_SHADE_STEPS };
	}, [
		fullPalette,
		baseSlug,
		mainPreset.slug,
		mainPreset.name,
		mainPreset.color,
	]);

	if (!stackRender) {
		return null;
	}

	const { hexByStep, baselineHexByStep, steps } = stackRender;
	const stackSpace = colorIndicatorStackMarginSpace(steps.length);
	const asteriskSize = size <= 14 ? '10' : '12';

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
			<div
				className={componentClassNames(
					'global-styles-color-shade-indicator-stack'
				)}
				style={
					{
						'--stack-space': stackSpace,
					} as CSSProperties
				}
			>
				{steps.map((step) => {
					const stepStr = String(step);
					const hex = hexByStep[stepStr] ?? '';
					const isBaseAnchorStep = step === COLOR_SHADE_ANCHOR_STEP;
					const showEditedMarker = shadeHexDiffersFromBaseline(
						hex,
						baselineHexByStep[stepStr]
					);

					return (
						<span
							key={`shade-stack-${stepStr}`}
							className={componentClassNames(
								'global-styles-color-shade-swatch',
								'global-styles-color-shade-swatch--indicator-stack'
							)}
						>
							{isBaseAnchorStep ? (
								<Icon
									icon="asterisk"
									iconSize={asteriskSize}
									className={componentInnerClassNames(
										'base-breakpoint-icon'
									)}
									aria-hidden
								/>
							) : null}
							{showEditedMarker ? (
								<span
									className={componentInnerClassNames(
										'color-shade-edited-indicator'
									)}
									aria-hidden
								/>
							) : null}
							<ColorIndicator
								type="color"
								value={hex || 'none'}
								size={size}
							/>
						</span>
					);
				})}
			</div>
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
