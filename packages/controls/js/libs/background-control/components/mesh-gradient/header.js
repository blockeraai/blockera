// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';
import { memo } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { ColorIndicator } from '@blockera/editor';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import type { MeshGradientHeaderItem } from '../../types';

const RepeaterItemHeader: MeshGradientHeaderItem = memo<MeshGradientHeaderItem>(
	({
		itemId,
		item,
		isOpen,
		setOpen,
		children,
		isOpenPopoverEvent,
	}: MeshGradientHeaderItem): Element<any> => {
		return (
			<div
				className={controlInnerClassNames('repeater-group-header')}
				onClick={(event) =>
					isOpenPopoverEvent(event) && setOpen(!isOpen)
				}
			>
				<span className={controlInnerClassNames('header-icon')}>
					<ColorIndicator value={item.color} />
				</span>

				<span className={controlInnerClassNames('header-label')}>
					{item.color ? item.color : __('None', 'blockera')}
				</span>

				<span className={controlInnerClassNames('header-values')}>
					{itemId === 0 ? __('Primary Color', 'blockera') : ''}
				</span>

				{children}
			</div>
		);
	}
);

export default RepeaterItemHeader;
