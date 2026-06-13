/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { useVarPickerPresetContext } from '@blockera/controls';
/**
 * Internal dependencies
 */
import { getGlobalStylesBorderPresetPreviewAttributes } from '../preset-preview/injected-helpers';
import {
	type BorderPresetPreviewUsage,
	DEFAULT_BORDER_PRESET_PREVIEW_USAGE,
} from './border-preset-preview-usage';
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
import type { VariableType } from '../components/types.ts';
import type { BorderBoxPreset } from './utils';
import { getBorderPresetAccessibilityDescription } from './utils';
import { BorderPresetOpenerValue } from './border-preset-opener-value';

export type BorderPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & BorderBoxPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

function resolveBorderPresetPreviewUsage(
	pickerCtx: ReturnType<typeof useVarPickerPresetContext>
): BorderPresetPreviewUsage {
	if (
		pickerCtx.active &&
		pickerCtx.variableType === 'border' &&
		pickerCtx.borderPresetPreviewUsage
	) {
		return pickerCtx.borderPresetPreviewUsage as BorderPresetPreviewUsage;
	}

	return DEFAULT_BORDER_PRESET_PREVIEW_USAGE;
}

export function BorderPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: BorderPresetOpenerProps) {
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const pickerCtx = useVarPickerPresetContext();
	const previewUsage = resolveBorderPresetPreviewUsage(pickerCtx);
	const a11ySummary = getBorderPresetAccessibilityDescription(
		variable?.border
	);

	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const patch = getGlobalStylesBorderPresetPreviewAttributes(
			variable?.border,
			previewUsage
		);
		if (!patch || !Object.keys(patch).length) {
			return null;
		}
		return { kind: 'attributes', patch };
	}, [variable?.border, previewUsage]);

	const previewHandlers = usePresetRowCanvasPreview(getPayload);

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={getPresetRepeaterHeaderOnClick({
				item: variable,
				isOpen,
				setOpen,
				isOpenPopoverEvent,
				allowEditPopover: canEditGlobalStyles,
				beforeClick: previewHandlers.onClick,
			})}
			onMouseEnter={previewHandlers.onMouseEnter}
			onMouseLeave={previewHandlers.onMouseLeave}
			aria-label={sprintf(
				// translators: %d: The item number (1-based index)
				__('Border preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="border-preset-repeater-item-header"
		>
			<span
				className={controlInnerClassNames('header-label')}
				data-cy="header-label"
			>
				{variable?.name}
			</span>

			<span
				className={controlInnerClassNames('header-values')}
				data-cy="header-values"
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
					minWidth: 0,
					maxWidth: '100%',
					overflow: 'hidden',
				}}
				title={a11ySummary || undefined}
			>
				<BorderPresetOpenerValue border={variable?.border} />
			</span>

			{children}
		</div>
	);
}
