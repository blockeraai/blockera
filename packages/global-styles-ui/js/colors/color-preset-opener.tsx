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
import {
	classNames,
	componentClassNames,
	controlInnerClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';
import { Icon } from '@blockera/icons';
import { ColorIndicator, useVarPickerPresetContext } from '@blockera/controls';
import { resolveThemeJsonPaintPresetStringFromWpEditor } from '@blockera/data';

/**
 * Internal dependencies
 */
import {
	type ColorPresetPreviewUsage,
	getGlobalStylesColorPresetPreviewAttributes,
	getGlobalStylesColorGradientPresetPreviewDeclarations,
} from '../preset-preview/injected-helpers';
import {
	usePresetRowCanvasPreview,
	type PresetCanvasPreviewPayload,
} from '../components/preset-row-preview-inject';
import type { VariableType } from '../components/types';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import {
	PresetVariableVariationsHeader,
	getPresetVariableVariationsDerivedState,
} from '../components/preset-variable-variations-header';
import { filterVariationsByBase } from './color-palette-variations-utils';
import { useColorPresetPreviewUsageFromProvider } from './color-preset-preview-context';
import { usePresetVariationsStorage } from '../context/preset-variations-context';
import {
	ColorShadesRepeaterItem,
	ColorPresetShadeStackHeader,
} from './color-shades-repeater-item';
import {
	generateColorShades,
	COLOR_SHADE_ANCHOR_STEP,
} from './color-shades-generator';
import {
	isShadePaletteColor,
	parsePaletteShadeSlug,
	shadeHexDiffersFromBaseline,
} from './utils';
import './style.scss';

export type ColorPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	contextType: 'repeater' | 'taxonomy';
	setOpen: (isOpen: boolean) => boolean;
	/** Lower priority than variable-picker context and ColorPresetPreviewUsageProvider. */
	previewUsage?: ColorPresetPreviewUsage;
	item: VariableType & {
		color?: string;
		type?: string;
		/** Parent preset slug when this row is a shade variation (variable picker strip). */
		baseSlug?: string;
	};
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
	contextType = 'repeater',
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
	const { fullItems } = usePresetVariationsStorage<Color>();

	const baseSlug = String(colorItem.slug ?? '');
	const isShadeRow = isShadePaletteColor(
		colorItem as Color & Record<string, unknown>
	);
	const shadeVariationCount = useMemo(() => {
		if (isShadeRow) {
			return 0;
		}
		return filterVariationsByBase(fullItems, baseSlug).length;
	}, [isShadeRow, fullItems, baseSlug]);

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

	const shadeSlugParsed = parsePaletteShadeSlug(String(colorItem.slug ?? ''));
	const parentBaseProp = String(
		(colorItem as { baseSlug?: string }).baseSlug ?? ''
	);
	const slugForMainLookup = isShadeRow
		? parentBaseProp || String(shadeSlugParsed?.baseSlug ?? '') || baseSlug
		: baseSlug;

	const mainPresetHexForRamp = useMemo(() => {
		const main = fullItems.find(
			(c) =>
				!isShadePaletteColor(c as Color & Record<string, unknown>) &&
				String(c.slug ?? '') === slugForMainLookup
		);
		return String(main?.color ?? colorItem.color ?? '#000000');
	}, [fullItems, slugForMainLookup, colorItem.color]);

	const baselineHexByStep = useMemo(
		() => generateColorShades(mainPresetHexForRamp),
		[mainPresetHexForRamp]
	);

	const shadeStepNum: number | null =
		shadeSlugParsed !== null ? Number(shadeSlugParsed.shadeStep) : null;

	const headerIcon = useMemo(() => {
		const indicatorPaint = resolveThemeJsonPaintPresetStringFromWpEditor({
			value: colorItem.color,
			presetSlug: slugForMainLookup,
			blockName: '',
			variablePickerType: colorItem.type,
		});

		const isGradient =
			colorItem.type === 'linear-gradient' ||
			colorItem.type === 'radial-gradient' ||
			(typeof indicatorPaint === 'string' &&
				indicatorPaint.includes('gradient(')) ||
			(typeof colorItem.color === 'string' &&
				colorItem.color.includes('gradient('));

		let indicatorValue = '';
		if (indicatorPaint !== '') {
			indicatorValue = indicatorPaint;
		} else if (
			typeof colorItem.color === 'string' &&
			colorItem.color !== ''
		) {
			indicatorValue = colorItem.color;
		}

		const core = indicatorValue ? (
			<ColorIndicator
				type={isGradient ? 'gradient' : 'color'}
				value={indicatorValue}
				size={18}
			/>
		) : (
			<ColorIndicator type="color" value="none" size={18} />
		);

		const showBaseShadeBadge =
			Boolean(colorItem?.color) &&
			!isGradient &&
			((isShadeRow && shadeStepNum === COLOR_SHADE_ANCHOR_STEP) ||
				(!isShadeRow && shadeVariationCount > 0));

		const showEditedShadeBadge =
			Boolean(colorItem?.color) &&
			!isGradient &&
			isShadeRow &&
			shadeStepNum !== null &&
			shadeStepNum !== COLOR_SHADE_ANCHOR_STEP &&
			shadeHexDiffersFromBaseline(
				colorItem.color ?? '',
				baselineHexByStep[String(shadeStepNum)]
			);

		if (!showBaseShadeBadge && !showEditedShadeBadge) {
			return core;
		}

		return (
			<span
				className={componentClassNames(
					'global-styles-color-shade-swatch',
					'global-styles-color-shade-swatch--preset-header-icon'
				)}
			>
				{showBaseShadeBadge ? (
					<Icon
						icon="asterisk"
						iconSize="12"
						className={componentInnerClassNames(
							'base-breakpoint-icon'
						)}
						aria-hidden
					/>
				) : null}
				{showEditedShadeBadge ? (
					<span
						className={componentInnerClassNames(
							'color-shade-edited-indicator'
						)}
						aria-hidden
					/>
				) : null}
				{core}
			</span>
		);
	}, [
		colorItem?.color,
		colorItem?.type,
		slugForMainLookup,
		isShadeRow,
		shadeVariationCount,
		shadeStepNum,
		baselineHexByStep,
	]);

	let trailingHeaderValues: React.ReactNode = null;
	if (contextType === 'taxonomy') {
		if (headerIcon || shadeVariationCount > 0) {
			trailingHeaderValues = (
				<span
					className={controlInnerClassNames('header-values')}
					data-cy="header-values"
				>
					{shadeVariationCount > 0 ? (
						<ColorPresetShadeStackHeader
							baseSlug={baseSlug}
							mainPreset={mainPresetForStack}
						/>
					) : (
						headerIcon
					)}
				</span>
			);
		}
	} else if (showHexValue) {
		trailingHeaderValues = (
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
		);
	}

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
					contextType === 'taxonomy' ? null : (
						<ColorPresetShadeStackHeader
							baseSlug={baseSlug}
							mainPreset={mainPresetForStack}
						/>
					)
				}
				variablePickerVariationStrip={
					<ColorShadesRepeaterItem
						usageType="manual"
						item={colorItem}
						itemId={itemId}
					/>
				}
				icon={contextType === 'taxonomy' ? null : headerIcon}
				label={colorItem?.name}
			/>

			{trailingHeaderValues}

			{children}
		</div>
	);
}
