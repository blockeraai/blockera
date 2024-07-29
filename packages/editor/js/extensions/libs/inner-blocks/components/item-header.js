// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Tooltip } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { isElement, getVirtualInnerBlockDescription } from '../helpers';

export default function ItemHeader({
	item,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}: {
	item: Object,
	itemId: number,
	isOpen: boolean,
	setOpen: (status: boolean) => void,
	children?: Element<any>,
	isOpenPopoverEvent: (event: SyntheticEvent<EventTarget>) => void,
}): Element<any> {
	return (
		<div
			className={controlInnerClassNames(
				'repeater-group-header',
				'blockera-inner-block-item'
			)}
			onClick={(event) => isOpenPopoverEvent(event) && setOpen(!isOpen)}
			aria-label={sprintf(
				// translators: it's the aria label for repeater item
				__('Item %s', 'blockera'),
				item?.name
			)}
		>
			<span className={controlInnerClassNames('header-icon')}>
				{item.icon}
			</span>

			<span
				className={controlInnerClassNames(
					'header-label',
					'blockera-inner-block-label'
				)}
			>
				{item.label}
			</span>

			{isElement(item) && (
				<Tooltip
					width="220px"
					style={{ padding: '12px' }}
					text={getVirtualInnerBlockDescription()}
				>
					<span className={controlInnerClassNames('header-values')}>
						{__('Virtual Block', 'blockera')}
					</span>
				</Tooltip>
			)}

			{children}
		</div>
	);
}
