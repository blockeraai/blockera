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
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import { useCanEditGlobalStyles } from '../components/use-global-styles-preset-edit';
import type { VariableType } from '../components/types';

export type WidthSizePresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { size?: string; value?: unknown };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

function resolveWidthSizeHeaderValue(
	variable: VariableType & { size?: string; value?: unknown }
): string {
	if (typeof variable?.size === 'string' && variable.size !== '') {
		return variable.size;
	}

	if (typeof variable?.value === 'string' && variable.value !== '') {
		return variable.value;
	}

	return '';
}

export function WidthSizePresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: WidthSizePresetOpenerProps) {
	const canEditGlobalStyles = useCanEditGlobalStyles();
	const headerValue = resolveWidthSizeHeaderValue(variable);

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={getPresetRepeaterHeaderOnClick({
				item: variable,
				isOpen,
				setOpen,
				isOpenPopoverEvent,
				allowEditPopover: canEditGlobalStyles,
			})}
			aria-label={sprintf(
				/* translators: %d: The item number (1-based index) */
				__('Width size preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="width-size-repeater-item-header"
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
					{headerValue}
				</span>
			</span>

			{children}
		</div>
	);
}
