// @flow

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import type { THeaderItem } from '../types';
import { selectedShape } from '../utils';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

const RepeaterItemHeader: THeaderItem = memo<THeaderItem>(
	({
		item: { position, color, shape },
		itemId,
		isOpen,
		setOpen,
		children,
		isOpenPopoverEvent,
	}: THeaderItem): Element<any> => {
		return (
			<div
				className={controlInnerClassNames('repeater-group-header')}
				onClick={(event) =>
					isOpenPopoverEvent(event) && setOpen(!isOpen)
				}
				aria-label={sprintf(
					// translators: it's the aria label for repeater item
					__('Item %d', 'blockera'),
					itemId + 1
				)}
			>
				<span
					data-test="divider-item-header"
					className={`shape-icon ${
						position === 'bottom' ? 'bottom' : ''
					}`}
					style={{ fill: color !== '#ffffff' && color }}
				>
					{selectedShape(shape?.id)?.icon}
				</span>

				{children}
			</div>
		);
	}
);

export default RepeaterItemHeader;
