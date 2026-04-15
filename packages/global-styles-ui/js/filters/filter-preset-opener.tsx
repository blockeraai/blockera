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
import { getGlobalStylesFilterPresetPreviewCss } from '../preset-preview/injected-helpers';
import { usePresetRowPreviewInject } from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import type { VariableType } from '../components/types.ts';
import { itemsToRepeaterRecord, type WpFilterPreset } from './utils';

export type FilterPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & WpFilterPreset;
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function FilterPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: FilterPresetOpenerProps) {
	const getPreviewDeclarations = useCallback(
		() =>
			getGlobalStylesFilterPresetPreviewCss(
				itemsToRepeaterRecord(variable.items || [])
			),
		[variable.items]
	);

	const previewHandlers = usePresetRowPreviewInject(getPreviewDeclarations);

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
				{variable?.name}
			</span>

			{children}
		</div>
	);
}
