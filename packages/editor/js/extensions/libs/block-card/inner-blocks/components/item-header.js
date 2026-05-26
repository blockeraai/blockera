// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { Icon as WordPressIconComponent } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { isString } from '@blockera/utils';
import { controlInnerClassNames } from '@blockera/classnames';

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
			{item.icon && (
				<span className={controlInnerClassNames('header-icon')}>
					{isString(item.icon) ? (
						<WordPressIconComponent icon={item.icon} />
					) : (
						item.icon
					)}
				</span>
			)}

			<span
				className={controlInnerClassNames(
					'header-label',
					'blockera-inner-block-label'
				)}
			>
				{item.label}
			</span>

			{children}
		</div>
	);
}
