/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import { ColorIndicator, useVarPickerPresetContext } from '@blockera/controls';
/**
 * Internal dependencies
 */
import {
	getGlobalStylesColorGradientPresetPreviewDeclarations,
	getGlobalStylesColorPresetPreviewAttributes,
	type ColorPresetPreviewUsage,
} from '../preset-preview/injected-helpers';
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
import type { VariableType } from '../components/types';
import {
	PresetVariableVariationsHeader,
	getPresetVariableVariationsDerivedState,
} from '../components/preset-variable-variations-header';
import { useColorPresetPreviewUsageFromProvider } from './color-preset-preview-context';
import { useColorPaletteVariationsStorage } from './color-palette-variations-context';
import { filterVariationsByBase } from './color-palette-variations-utils';
import {
	ColorPresetShadeStackHeader,
	ColorShadesRepeaterItem,
} from './color-shades-repeater-item';
import { isShadePaletteColor } from './utils';

export type ColorPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	/** Lower priority than variable-picker context and ColorPresetPreviewUsageProvider. */
	previewUsage?: ColorPresetPreviewUsage;
	item: VariableType & { color?: string; type?: string };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
	variationsAccordionOpen: boolean;
};

function resolveColorPresetPreviewUsage(
	pickerCtx: ReturnType<typeof useVarPickerPresetContext>,
	fromProvider: ColorPresetPreviewUsage | undefined,
	propUsage: ColorPresetPreviewUsage | undefined
): ColorPresetPreviewUsage {
	const fromPicker = pickerCtx.colorPresetPreviewUsage;
	if (
		pickerCtx.active &&
		pickerCtx.variableType === 'color' &&
		(fromPicker === 'color' || fromPicker === 'background')
	) {
		return fromPicker;
	}

	return fromProvider ?? propUsage ?? 'background';
}

export function ColorPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: colorItem,
	isOpenPopoverEvent,
	variationsAccordionOpen,
	previewUsage: previewUsageProp,
}: ColorPresetOpenerProps) {
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const pickerCtx = useVarPickerPresetContext();
	const fromProvider = useColorPresetPreviewUsageFromProvider();
	const previewUsage = resolveColorPresetPreviewUsage(
		pickerCtx,
		fromProvider,
		previewUsageProp
	);

	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const color = colorItem?.color;
		const type = colorItem?.type ?? '';
		const isGradient =
			type === 'linear-gradient' ||
			type === 'radial-gradient' ||
			(typeof color === 'string' && color.includes('gradient('));

		if (isGradient) {
			const declarations =
				getGlobalStylesColorGradientPresetPreviewDeclarations(
					{
						color: colorItem?.color,
						type: colorItem?.type,
					},
					previewUsage
				);
			if (!declarations) {
				return null;
			}
			return { kind: 'declarations', declarations };
		}

		const patch = getGlobalStylesColorPresetPreviewAttributes(
			{
				color: colorItem?.color,
				type: colorItem?.type,
			},
			previewUsage
		);
		if (!patch || !Object.keys(patch).length) {
			return null;
		}
		return { kind: 'attributes', patch };
	}, [colorItem?.color, colorItem?.type, previewUsage]);

	const previewHandlers = usePresetRowCanvasPreview(getPayload);
	const { fullPalette } = useColorPaletteVariationsStorage();

	const baseSlug = String(colorItem.slug ?? '');
	const isShadeRow = isShadePaletteColor(
		colorItem as Color & Record<string, unknown>
	);
	const shadeVariationCount = useMemo(() => {
		if (isShadeRow) {
			return 0;
		}
		return filterVariationsByBase(fullPalette, baseSlug).length;
	}, [isShadeRow, fullPalette, baseSlug]);

	const mainPresetForStack = useMemo(
		() => ({
			slug: baseSlug,
			name: String(colorItem.name ?? ''),
			color: colorItem.color,
		}),
		[baseSlug, colorItem.name, colorItem.color]
	);

	const { isVariableVariationsPickerHeader } = useMemo(
		() =>
			getPresetVariableVariationsDerivedState({
				isVariationChildRow: isShadeRow,
				variationCount: shadeVariationCount,
				isVariablePickerActive: true === pickerCtx.active,
			}),
		[isShadeRow, shadeVariationCount, pickerCtx.active]
	);
	const showHexValue = shadeVariationCount === 0 && colorItem?.color;

	const headerIcon = useMemo(
		() =>
			colorItem?.color ? (
				<ColorIndicator
					type={
						colorItem.type === 'linear-gradient' ||
						colorItem.type === 'radial-gradient'
							? 'gradient'
							: 'color'
					}
					value={colorItem.color}
					size={18}
				/>
			) : (
				<ColorIndicator type="color" value="none" size={18} />
			),
		[colorItem?.color, colorItem?.type]
	);

	return (
		<div
			className={classNames(
				controlInnerClassNames('repeater-group-header'),
				{
					'is-preset-variable-variations-picker-header':
						isVariableVariationsPickerHeader,
				}
			)}
			onClick={getPresetRepeaterHeaderOnClick({
				item: colorItem,
				isOpen,
				setOpen,
				isOpenPopoverEvent,
				allowEditPopover: canEditGlobalStyles,
			})}
			onMouseEnter={previewHandlers.onMouseEnter}
			onMouseLeave={previewHandlers.onMouseLeave}
			aria-label={sprintf(
				/* translators: %d: The item number (1-based index) */
				__('Color preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="color-repeater-item-header"
		>
			<PresetVariableVariationsHeader
				isVariationChildRow={isShadeRow}
				variationCount={shadeVariationCount}
				variationsAccordionOpen={variationsAccordionOpen}
				isVariablePickerActive={true === pickerCtx.active}
				collapsedVariationStack={
					<ColorPresetShadeStackHeader
						baseSlug={baseSlug}
						mainPreset={mainPresetForStack}
					/>
				}
				variablePickerVariationStrip={
					<ColorShadesRepeaterItem item={colorItem} itemId={itemId} />
				}
				icon={headerIcon}
				label={colorItem?.name}
			/>

			{showHexValue ? (
				<span
					className={controlInnerClassNames('header-values')}
					data-cy="header-values"
				>
					<span
						style={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '110px',
							textTransform: 'lowercase',
							opacity: 0.5,
						}}
					>
						{colorItem?.color}
					</span>
				</span>
			) : null}

			{children}
		</div>
	);
}
