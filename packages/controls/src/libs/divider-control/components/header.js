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
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

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
					__('Item %d', 'publisher-core'),
					itemId + 1
				)}
			>
				<span
					className={`shape-icon ${
						position === 'bottom' ? 'bottom' : ''
					}`}
					style={{ fill: color }}
				>
					{selectedShape(shape?.id)?.icon}
				</span>

				{children}
			</div>
		);
	}
);

export default RepeaterItemHeader;
