/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { memo, useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { RepeaterContext } from '../../repeater-control/context';
import { getAttributeItemIcon } from '../utils';

const RepeaterItemHeader = ({
	item: { key, value },
	itemId,
	isOpen,
	setOpen,
	children,
	isOpenPopoverEvent,
}) => {
	const { customProps } = useContext(RepeaterContext);

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
				{getAttributeItemIcon({
					element: customProps.attributeElement,
					attribute: key,
				})}
			</span>

			<span
				className={controlInnerClassNames('header-label')}
				style={{ textTransform: key ? 'initial' : '' }}
			>
				{key
					? key.replace(/^data-/, '').replace(/^aria-/, '')
					: __('None', 'publisher-core')}
			</span>

			<span
				className={controlInnerClassNames('header-values')}
				style={{ textTransform: 'initial' }}
			>
				{value}
			</span>

			{children}
		</div>
	);
};

export default memo(RepeaterItemHeader);
