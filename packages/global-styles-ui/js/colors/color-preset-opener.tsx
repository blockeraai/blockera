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
import { getPresetRepeaterHeaderOnClick } from '../components/preset-repeater-header-click';
import type { VariableType } from '../components/types';

export type ColorPresetOpenerProps = {
	itemId: string;
	isOpen: boolean;
	children?: React.ReactNode;
	setOpen: (isOpen: boolean) => boolean;
	item: VariableType & { color?: string; type?: string };
	isOpenPopoverEvent: (event: React.MouseEvent) => boolean;
};

export function ColorPresetOpener({
	itemId,
	isOpen,
	setOpen,
	children,
	item: variable,
	isOpenPopoverEvent,
}: ColorPresetOpenerProps) {
	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={getPresetRepeaterHeaderOnClick({
				item: variable,
				isOpen,
				setOpen,
				isOpenPopoverEvent,
			})}
			aria-label={sprintf(
				/* translators: %d: The item number (1-based index) */
				__('Color preset %d', 'blockera'),
				Number(itemId) + 1
			)}
			data-cy="color-repeater-item-header"
		>
			<span
				className={controlInnerClassNames('header-icon')}
				data-cy="header-icon"
			>
				{variable?.color ? (
					<ColorIndicator
						type={
							variable.type === 'linear-gradient' ||
							variable.type === 'radial-gradient'
								? 'gradient'
								: 'color'
						}
						value={variable.color}
						size={18}
					/>
				) : (
					<ColorIndicator type="color" value="none" size={18} />
				)}
			</span>

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
					{variable?.color}
				</span>
			</span>

			{children}
		</div>
	);
}
