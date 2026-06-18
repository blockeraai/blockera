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
/**
 * Internal dependencies
 */
import { getGlobalStylesTransitionPresetPreviewAttributes } from '../preset-preview/injected-helpers';
import {
	type PresetCanvasPreviewPayload,
	usePresetRowCanvasPreview,
} from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
import type { VariableType } from '../components/types.ts';
import { itemsToRepeaterRecord, type WpTransitionPreset } from './utils';
import { usePresetTaxonomyHeaderLabel } from '../components';

export type TransitionPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	contextType?: 'repeater' | 'taxonomy';
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & WpTransitionPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function TransitionPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
	contextType = 'repeater',
}: TransitionPresetOpenerProps) {
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const headerLabel = usePresetTaxonomyHeaderLabel(variable, contextType);
	const getPayload = useCallback((): PresetCanvasPreviewPayload | null => {
		const patch = getGlobalStylesTransitionPresetPreviewAttributes(
			itemsToRepeaterRecord(variable.items || [])
		);
		if (!patch || !Object.keys(patch).length) {
			return null;
		}
		return { kind: 'attributes', patch };
	}, [variable.items]);

	const previewHandlers = usePresetRowCanvasPreview(getPayload);

	return (
		<div
			className={classNames(
				controlInnerClassNames('repeater-group-header'),
				'blockera-transition-preset-opener-header'
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
				__('Transition preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="transition-preset-repeater-item-header"
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
