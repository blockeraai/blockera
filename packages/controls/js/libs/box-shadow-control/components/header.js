// @flow
/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import type { THeaderItem } from '../types';
import { prepValueForHeader } from '../../repeater-control/utils';

/**
 * Blockera dependencies
 */
import { ColorIndicator } from '@blockera/components';
import { controlInnerClassNames } from '@blockera/classnames';

const RepeaterItemHeader: THeaderItem = memo<THeaderItem>(
	({
		item: { type, x, y, blur, spread, color = '#fff' },
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
				<span className={controlInnerClassNames('header-icon')}>
					<ColorIndicator value={color} />
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{type === 'inner'
						? __('Inner', 'blockera')
						: __('Outer', 'blockera')}
				</span>

				<span className={controlInnerClassNames('header-values')}>
					{prepValueForHeader(x)}
					{prepValueForHeader(y)}
					{prepValueForHeader(blur)}
					{prepValueForHeader(spread)}
				</span>

				{children}
			</div>
		);
	}
);

export default RepeaterItemHeader;
