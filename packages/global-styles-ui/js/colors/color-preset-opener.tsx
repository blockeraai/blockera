/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { ColorIndicator, useVarPickerPresetContext } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';
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
import type { VariableType } from '../components/types';
import { useColorPresetPreviewUsageFromProvider } from './color-preset-preview-context';

export type ColorPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { color?: string; type?: string };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
	/** Lower priority than variable-picker context and ColorPresetPreviewUsageProvider. */
	previewUsage?: ColorPresetPreviewUsage;
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
	item: variable,
	isOpenPopoverEvent,
	previewUsage: previewUsageProp,
}: ColorPresetOpenerProps) {
	const pickerCtx = useVarPickerPresetContext();
	const fromProvider = useColorPresetPreviewUsageFromProvider();
	const previewUsage = resolveColorPresetPreviewUsage(
		pickerCtx,
		fromProvider,
		previewUsageProp
	);

	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const color = variable?.color;
		const type = variable?.type ?? '';
		const isGradient =
			type === 'linear-gradient' ||
			type === 'radial-gradient' ||
			(typeof color === 'string' && color.includes('gradient('));

		if (isGradient) {
			const declarations =
				getGlobalStylesColorGradientPresetPreviewDeclarations(
					{
						color: variable?.color,
						type: variable?.type,
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
				color: variable?.color,
				type: variable?.type,
			},
			previewUsage
		);
		if (!patch || !Object.keys(patch).length) {
			return null;
		}
		return { kind: 'attributes', patch };
	}, [variable?.color, variable?.type, previewUsage]);

	const previewHandlers = usePresetRowCanvasPreview(getPayload);

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={getPresetRepeaterHeaderOnClick({
				item: variable,
				isOpen,
				setOpen,
				isOpenPopoverEvent,
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
			<span
				className={controlInnerClassNames('header-icon')}
				data-cy="header-icon"
			>
				{variable?.color ? (
					<ColorIndicator
						type={
							variable.type === 'linear-gradient' ||
							variable.type === 'radial-gradient'
								? 'gradient'
								: 'color'
						}
						value={variable.color}
						size={18}
					/>
				) : (
					<ColorIndicator type="color" value="none" size={18} />
				)}
			</span>

			<span
				className={controlInnerClassNames('header-label')}
				data-cy="header-label"
			>
				{variable?.name}
			</span>

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
					{variable?.color}
				</span>
			</span>

			{children}
		</div>
	);
}
