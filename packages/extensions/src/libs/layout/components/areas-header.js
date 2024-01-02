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
import type { TAreasHeaderItem as THeaderItem } from '../types/layout-props';
import AreaIcon from '../icons/area-icon';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

const AreasHeader: THeaderItem = memo<THeaderItem>(
	({
		item: { name },
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
					__('Item %d', 'publisher-core'),
					itemId + 1
				)}
			>
				<span className={controlInnerClassNames('header-icon')}>
					{<AreaIcon />}
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{name}
				</span>

				{children}
			</div>
		);
	}
);

export default AreasHeader;
