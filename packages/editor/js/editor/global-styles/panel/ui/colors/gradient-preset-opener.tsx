/**
 * External dependencies
 */
import React from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { ColorIndicator } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { VariableType } from '../components/types';

export type GradientPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { gradient?: string };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function GradientPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: GradientPresetOpenerProps) {
	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event: React.MouseEvent) =>
				isOpenPopoverEvent(event) && setOpen(!isOpen)
			}
			aria-label={sprintf(
				/* translators: %d: The item number (1-based index) */
				__('Gradient preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="gradient-repeater-item-header"
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
				{variable?.gradient ? (
					<ColorIndicator
						type="gradient"
						value={variable.gradient}
						size={20}
					/>
				) : (
					__('EMPTY', 'blockera')
				)}
			</span>

			{children}
		</div>
	);
}
