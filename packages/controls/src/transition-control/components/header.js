/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { getTypeLabel } from '../utils';
import { default as TransitionIcon } from '../icons/transition';

const RepeaterItemHeader = ({
	item: { type, duration },
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
				<TransitionIcon />
			</span>

			<span className={controlInnerClassNames('header-label')}>
				{getTypeLabel(type)}
			</span>

			<span className={controlInnerClassNames('header-values')}>
				{duration}
			</span>

			{children}
		</div>
	);
};

export default memo(RepeaterItemHeader);
