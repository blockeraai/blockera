// @flow
/**
 * External dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { getTypeLabel } from '../utils';
import { default as TransitionIcon } from '../icons/transition';
import type { THeaderItem } from '../types';
import { prepValueForHeader } from '../../repeater-control/utils';

const RepeaterItemHeader: THeaderItem = memo<THeaderItem>(
	({
		item: { duration, type },
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
					itemId && itemId + 1
				)}
			>
				<span className={controlInnerClassNames('header-icon')}>
					<TransitionIcon />
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{getTypeLabel(type)}
				</span>

				<span className={controlInnerClassNames('header-values')}>
					{prepValueForHeader(duration)}
				</span>

				{children}
			</div>
		);
	}
);

export default RepeaterItemHeader;
