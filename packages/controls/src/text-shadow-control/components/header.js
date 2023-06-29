/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { ColorIndicator } from '@publisher/components';

const RepeaterItemHeader = ({
	item: { x, y, blur, color = '#fff' },
	itemId,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}) => {
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
				<ColorIndicator value={color} />
			</span>

			<span className={controlInnerClassNames('header-label')}>
				{__('Text Shadow', 'publisher-core')}
			</span>

			<span className={controlInnerClassNames('header-values')}>
				{`${x} ${y} ${blur}`}
			</span>

			{children}
		</div>
	);
};

export default memo(RepeaterItemHeader);
