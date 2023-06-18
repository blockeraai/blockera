/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext, useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import ActionsUI from './actions-ui';
import { RepeaterContext } from '../context';
import { isOpenPopoverEvent } from '../utils';
import GroupControl from '../../group-control';

const RepeaterItem = ({ item, itemId }) => {
	const [isOpen, setOpen] = useState(false);
	const [isVisible, setVisibility] = useState(true);
	const {
		design,
		InnerComponents,
		Header: CustomHeader,
		sortItems,
		repeaterItems: items,
		isPopover,
		popoverLabel,
		repeaterItemsPopoverClassName,
	} = useContext(RepeaterContext);
	const actionsProps = {
		item,
		itemId,
		isOpen,
		setOpen,
		isVisible,
		setVisibility,
		isOpenPopoverEvent,
	};

	return (
		<div className={controlInnerClassNames('repeater-item')}>
			<GroupControl
				isDraggable={true}
				design={design}
				groupId={itemId}
				dropArgs={items}
				dropCallback={sortItems}
				popoverClassName={repeaterItemsPopoverClassName}
				className={controlInnerClassNames('repeater-item-group')}
				header={
					!CustomHeader ? (
						<div
							className={controlInnerClassNames(
								'repeater-group-header'
							)}
							onClick={(event) =>
								isOpenPopoverEvent(event) && setOpen(!isOpen)
							}
						>
							{__('Item ', 'publisher') + itemId}
							<ActionsUI {...actionsProps} />
						</div>
					) : (
						<CustomHeader {...actionsProps}>
							<ActionsUI {...actionsProps} />
						</CustomHeader>
					)
				}
				children={<InnerComponents {...{ item, itemId }} />}
				isOpen={isOpen}
				isVisible={isVisible}
				isPopover={isPopover}
				popoverLabel={popoverLabel}
				onClose={() => {
					setOpen(false);
				}}
			/>
		</div>
	);
};

export default memo(RepeaterItem);
