/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { ColorIndicator } from '@blockera/components';

/**
 * Internal dependencies
 */
import { prepValueForHeader } from '../../repeater-control/utils';

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
				__('Item %d', 'blockera-core'),
				itemId + 1
			)}
			data-cy="text-shadow-repeater-item-header"
		>
			<span
				className={controlInnerClassNames('header-icon')}
				data-cy="header-icon"
			>
				<ColorIndicator value={color} />
			</span>

			<span
				className={controlInnerClassNames('header-label')}
				data-cy="header-label"
			>
				{__('Text Shadow', 'blockera-core')}
			</span>

			<span
				className={controlInnerClassNames('header-values')}
				data-cy="header-values"
			>
				{prepValueForHeader(x)}
				{prepValueForHeader(y)}
				{prepValueForHeader(blur)}
			</span>

			{children}
		</div>
	);
};

export default memo(RepeaterItemHeader);
