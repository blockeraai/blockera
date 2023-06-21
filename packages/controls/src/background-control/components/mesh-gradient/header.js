/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { ColorIndicator } from '@publisher/components';

/**
 * Internal dependencies
 */

const Header = ({
	itemId,
	item,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}) => {
	return (
		<div
			className={controlInnerClassNames('repeater-group-header')}
			onClick={(event) => isOpenPopoverEvent(event) && setOpen(!isOpen)}
		>
			<span className={controlInnerClassNames('header-icon')}>
				<ColorIndicator value={item.color} />
			</span>

			<span className={controlInnerClassNames('header-label')}>
				{item.color ? item.color : __('None', 'publisher-core')}
			</span>

			<span className={controlInnerClassNames('header-values')}>
				{itemId === 0 ? __('Primary Color', 'publisher-core') : ''}
			</span>

			{children}
		</div>
	);
};

export default memo(Header);
