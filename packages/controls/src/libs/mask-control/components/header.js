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
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { selectedShape } from '../utils';
import type { THeaderItem } from '../types';

const RepeaterItemHeader: THeaderItem = memo<THeaderItem>(
	({
		item,
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
					__('Item %d', 'blockera-core'),
					itemId + 1
				)}
				data-test="mask-item-header"
			>
				<span
					className={`${controlInnerClassNames('header-icon')} ${
						item['horizontally-flip'] ? 'h-flip' : ''
					} ${item['vertically-flip'] ? 'v-flip' : ''}`}
				>
					{selectedShape(item.shape?.id)?.icon}
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{item.shape?.id}
				</span>

				{children}
			</div>
		);
	}
);
export default RepeaterItemHeader;
