// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { Element } from 'react';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { THeaderItem } from '../types';

const RepeaterItemHeader: THeaderItem = memo<THeaderItem>(
	({
		item: { name, value },
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
					// translators: %d: The item number (1-based index)
					__('Item %d', 'blockera'),
					itemId + 1
				)}
			>
				<span className={controlInnerClassNames('header-icon')}>
					<Icon icon="css-3" iconSize="24" />
				</span>
				<span
					className={controlInnerClassNames('header-label')}
					style={{ textTransform: name ? 'initial' : '' }}
				>
					{name}
				</span>
				<span
					className={controlInnerClassNames('header-values')}
					style={{ textTransform: 'initial' }}
				>
					{value}
				</span>
				{children}
			</div>
		);
	}
);

export default RepeaterItemHeader;
