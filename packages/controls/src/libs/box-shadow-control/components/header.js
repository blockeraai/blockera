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
	item: { type, x, y, blur, spread, color = '#fff' },
	itemId,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}) => {
	const heading = () => {
		return `${x} ${y} ${blur} ${spread}`;
	};

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
				{type === 'inner'
					? __('Inner', 'publisher-core')
					: __('Outer', 'publisher-core')}
			</span>

			<span className={controlInnerClassNames('header-values')}>
				{heading()}
			</span>

			{children}
		</div>
	);
};

export default memo(RepeaterItemHeader);
