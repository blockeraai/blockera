// @flow
/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { memo } from '@wordpress/element';
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import SearchReplaceIcon from '../icons/search-replace';
import type { THeaderItem } from '../types';

const RepeaterItemHeader: THeaderItem = memo<THeaderItem>(
	({
		item: { search, replace },
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
					<SearchReplaceIcon />
				</span>
				<span
					className={controlInnerClassNames('header-label')}
					style={{ textTransform: search ? 'initial' : '' }}
				>
					{search}
				</span>
				<span
					className={controlInnerClassNames('header-values')}
					style={{ textTransform: 'initial' }}
				>
					{replace}
				</span>
				{children}
			</div>
		);
	}
);

export default RepeaterItemHeader;
