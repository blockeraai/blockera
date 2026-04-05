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
import { formatRadiusPresetHeaderValue } from './utils';

export type BorderRadiusPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { size: string | number };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function BorderRadiusPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: BorderRadiusPresetOpenerProps) {
	const displaySize =
		variable?.size === 0 || variable?.size === '0'
			? String(variable.size)
			: (variable?.size ?? '');

	const summary = formatRadiusPresetHeaderValue(displaySize);
	const display = summary || __('EMPTY', 'blockera');

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event: React.MouseEvent) =>
				isOpenPopoverEvent(event) && setOpen(!isOpen)
			}
			aria-label={sprintf(
				// translators: %d: The item number (1-based index)
				__('Border radius preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="border-radius-preset-repeater-item-header"
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
					display: 'block',
					minWidth: 0,
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					textAlign: 'right',
					fontVariantNumeric: 'tabular-nums',
				}}
				title={summary || undefined}
			>
				{display}
			</span>

			{children}
		</div>
	);
}
