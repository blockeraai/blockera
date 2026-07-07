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
import { getGlobalStylesSpacingSizePresetPreviewAttributes } from '../preset-preview/injected-helpers';
import {
	type SpacingSizePresetUsage,
	SPACING_PRESET_PREVIEW_USAGES,
	DEFAULT_SPACING_PRESET_PREVIEW_USAGE,
} from './spacing-preset-preview-usage';
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
import type { VariableType } from '../components/types.ts';
import { useSpacingPresetPreviewUsageFromProvider } from './spacing-preset-preview-context';
import { usePresetTaxonomyHeaderLabel } from '../components';

export type SpacingPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	contextType?: 'repeater' | 'taxonomy';
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { size: string };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
	/**
	 * Explicit preview mode (e.g. embedded preset list). Lower priority than variable-picker
	 * context and SpacingPresetPreviewUsageProvider.
	 */
	previewUsage?: SpacingSizePresetUsage;
};

function resolveSpacingPresetPreviewUsage(
	pickerCtx: ReturnType<typeof useVarPickerPresetContext>,
	fromProvider: SpacingSizePresetUsage | undefined,
	propUsage: SpacingSizePresetUsage | undefined
): SpacingSizePresetUsage {
	if (
		pickerCtx.active &&
		pickerCtx.variableType === 'spacing' &&
		pickerCtx.spacingPresetPreviewUsage &&
		SPACING_PRESET_PREVIEW_USAGES.has(pickerCtx.spacingPresetPreviewUsage)
	) {
		return pickerCtx.spacingPresetPreviewUsage as SpacingSizePresetUsage;
	}

	return fromProvider ?? propUsage ?? DEFAULT_SPACING_PRESET_PREVIEW_USAGE;
}

export function SpacingPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
	previewUsage: previewUsageProp,
	contextType = 'repeater',
}: SpacingPresetOpenerProps) {
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const headerLabel = usePresetTaxonomyHeaderLabel(variable, contextType);
	const pickerCtx = useVarPickerPresetContext();
	const fromProvider = useSpacingPresetPreviewUsageFromProvider();
	const previewUsage = resolveSpacingPresetPreviewUsage(
		pickerCtx,
		fromProvider,
		previewUsageProp
	);

	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const patch = getGlobalStylesSpacingSizePresetPreviewAttributes(
			variable?.size,
			previewUsage
		);
		if (!patch || !Object.keys(patch).length) {
			return null;
		}
		return { kind: 'attributes', patch };
	}, [variable?.size, previewUsage]);

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
				__('Spacing size preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="spacing-size-repeater-item-header"
		>
			<span
				className={controlInnerClassNames('header-label')}
				data-cy="header-label"
			>
				{headerLabel}
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
					{variable?.size}
				</span>
			</span>

			{children}
		</div>
	);
}
