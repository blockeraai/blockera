// @flow
/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { prepValueForHeader } from '../../repeater-control/utils';
import type { TransformControlRepeaterItemValue } from '../types';

const RepeaterItemHeader = ({
	item,
	itemId,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}: {
	item: TransformControlRepeaterItemValue,
	itemId: number,
	isOpen: boolean,
	setOpen: (state: boolean) => void,
	children: any,
	isOpenPopoverEvent: (event: MouseEvent) => boolean,
}) => {
	let label, icon, value;

	switch (item.type) {
		case 'move':
			label = __('Move', 'blockera');
			value = (
				<>
					{prepValueForHeader(item['move-x'])}
					{prepValueForHeader(item['move-y'])}
					{prepValueForHeader(item['move-z'])}
				</>
			);
			icon = <Icon icon="transform-move" />;
			break;

		case 'scale':
			label = __('Scale', 'blockera');
			value = prepValueForHeader(item.scale);
			icon = <Icon icon="transform-scale" />;
			break;

		case 'rotate':
			label = __('Rotate', 'blockera');
			value = (
				<>
					{prepValueForHeader(item['rotate-x'])}
					{prepValueForHeader(item['rotate-y'])}
					{prepValueForHeader(item['rotate-z'])}
				</>
			);
			icon = <Icon icon="transform-rotate" />;
			break;

		case 'skew':
			label = __('Skew', 'blockera');
			value = (
				<>
					{prepValueForHeader(item['skew-x'])}
					{prepValueForHeader(item['skew-y'])}
				</>
			);
			icon = <Icon icon="transform-skew" />;
			break;
	}

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event) => isOpenPopoverEvent(event) && setOpen(!isOpen)}
			aria-label={sprintf(
				// translators: it's the aria label for repeater item
				__('Item %d', 'blockera'),
				itemId + 1
			)}
		>
			<span className={controlInnerClassNames('header-icon')}>
				{icon}
			</span>

			<span className={controlInnerClassNames('header-label')}>
				{label}
			</span>

			<span className={controlInnerClassNames('header-values')}>
				{value}
			</span>

			{children}
		</div>
	);
};

// $FlowFixMe
export default memo(RepeaterItemHeader);
