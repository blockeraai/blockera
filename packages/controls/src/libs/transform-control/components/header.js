/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { convertDegToCharacter } from '@publisher/utils';

/**
 * Internal dependencies
 */

import { default as MoveIcon } from '../icons/move';
import { default as RotateIcon } from '../icons/rotate';
import { default as ScaleIcon } from '../icons/scale';
import { default as SkewIcon } from '../icons/skew';

const RepeaterItemHeader = ({
	item,
	itemId,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}) => {
	let label, icon, value;

	switch (item.type) {
		case 'move':
			label = __('Move', 'publisher-core');
			value = `${item['move-x']} ${item['move-y']} ${item['move-z']}`;
			icon = <MoveIcon />;
			break;

		case 'scale':
			label = __('Scale', 'publisher-core');
			value = item.scale;
			icon = <ScaleIcon />;
			break;

		case 'rotate':
			label = __('Rotate', 'publisher-core');
			value = `${convertDegToCharacter(
				item['rotate-x']
			)} ${convertDegToCharacter(
				item['rotate-y']
			)} ${convertDegToCharacter(item['rotate-z'])}`;
			icon = <RotateIcon />;
			break;

		case 'skew':
			label = __('Skew', 'publisher-core');
			value = `${convertDegToCharacter(
				item['skew-x']
			)} ${convertDegToCharacter(item['skew-y'])}`;
			icon = <SkewIcon />;
			break;
	}

	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event) => isOpenPopoverEvent(event) && setOpen(!isOpen)}
			aria-label={sprintf(
				// translators: it's the aria label for repeater item
				__('Item %d', 'publisher-core'),
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

export default memo(RepeaterItemHeader);
