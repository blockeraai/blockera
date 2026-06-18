/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { classNames, controlInnerClassNames } from '@blockera/classnames';
import { useVarPickerPresetContext } from '@blockera/controls';
/**
 * Internal dependencies
 */
import { getGlobalStylesFilterPresetPreviewAttributes } from '../preset-preview/injected-helpers';
import {
	type FilterPresetPreviewUsage,
	DEFAULT_FILTER_PRESET_PREVIEW_USAGE,
} from './filter-preset-preview-usage';
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
import type { VariableType } from '../components/types.ts';
import { itemsToRepeaterRecord, type WpFilterPreset } from './utils';
import { usePresetTaxonomyHeaderLabel } from '../components';

export type FilterPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	contextType?: 'repeater' | 'taxonomy';
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & WpFilterPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

function resolveFilterPresetPreviewUsage(
	pickerCtx: ReturnType<typeof useVarPickerPresetContext>
): FilterPresetPreviewUsage {
	if (
		pickerCtx.active &&
		pickerCtx.variableType === 'filter' &&
		pickerCtx.filterPresetPreviewUsage
	) {
		return pickerCtx.filterPresetPreviewUsage as FilterPresetPreviewUsage;
	}

	return DEFAULT_FILTER_PRESET_PREVIEW_USAGE;
}

export function FilterPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
	contextType = 'repeater',
}: FilterPresetOpenerProps) {
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const headerLabel = usePresetTaxonomyHeaderLabel(variable, contextType);
	const pickerCtx = useVarPickerPresetContext();
	const previewUsage = resolveFilterPresetPreviewUsage(pickerCtx);

	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const patch = getGlobalStylesFilterPresetPreviewAttributes(
			itemsToRepeaterRecord(variable.items || []),
			previewUsage
		);
		if (!patch || !Object.keys(patch).length) {
			return null;
		}
		return { kind: 'attributes', patch };
	}, [variable.items, previewUsage]);

	const previewHandlers = usePresetRowCanvasPreview(getPayload);

	return (
		<div
			className={classNames(
				controlInnerClassNames('repeater-group-header'),
				'blockera-filter-preset-opener-header'
			)}
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
				__('Filter preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="filter-preset-repeater-item-header"
		>
			<span
				className={controlInnerClassNames('header-label')}
				data-cy="header-label"
			>
				{headerLabel}
			</span>

			{children}
		</div>
	);
}
