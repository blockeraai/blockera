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

/**
 * Internal dependencies
 */

import { default as MoveIcon } from '../icons/move';
import { default as RotateIcon } from '../icons/rotate';
import { default as ScaleIcon } from '../icons/scale';
import { default as SkewIcon } from '../icons/skew';
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
			icon = <MoveIcon />;
			break;

		case 'scale':
			label = __('Scale', 'blockera');
			value = prepValueForHeader(item.scale);
			icon = <ScaleIcon />;
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
			icon = <RotateIcon />;
			break;

		case 'skew':
			label = __('Skew', 'blockera');
			value = (
				<>
					{prepValueForHeader(item['skew-x'])}
					{prepValueForHeader(item['skew-y'])}
				</>
			);
			icon = <SkewIcon />;
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
