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
import { getGlobalStylesTransitionPresetPreviewCss } from '../preset-preview/injected-helpers';
import { usePresetRowPreviewInject } from '../components/preset-row-preview-inject';
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import type { VariableType } from '../components/types.ts';
import { itemsToRepeaterRecord, type WpTransitionPreset } from './utils';

export type TransitionPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
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
}: TransitionPresetOpenerProps) {
	const getPreviewDeclarations = useCallback(
		() =>
			getGlobalStylesTransitionPresetPreviewCss(
				itemsToRepeaterRecord(variable.items || [])
			),
		[variable.items]
	);

	const previewHandlers = usePresetRowPreviewInject(getPreviewDeclarations);

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
				{variable?.name}
			</span>

			{children}
		</div>
	);
}
