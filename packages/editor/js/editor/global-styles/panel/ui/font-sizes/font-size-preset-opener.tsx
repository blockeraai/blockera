/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { VariableType } from '../components/types.ts';

export type FontSizePresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { size: string };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function FontSizePresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: FontSizePresetOpenerProps) {
	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event: React.MouseEvent) =>
				isOpenPopoverEvent(event) && setOpen(!isOpen)
			}
			aria-label={sprintf(
				// translators: %d: The item number (1-based index)
				__('Font size preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="font-size-repeater-item-header"
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
			>
				{variable?.size || __('EMPTY', 'blockera')}
			</span>

			{children}
		</div>
	);
}
