/**
 * External dependencies
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
import RepeaterItemActions from './actions';
import { RepeaterContext } from '../context';
import { isOpenPopoverEvent } from '../utils';
import GroupControl from '../../group-control';

const RepeaterItem = ({ item, itemId }) => {
	const [isOpen, setOpen] = useState(false);
	const [isVisible, setVisibility] = useState(item?.isVisible);

	const {
		design,
		repeaterItemChildren: RepeaterItemChildren,
		repeaterItemHeader: RepeaterItemHeader,
		sortItems,
		repeaterItems: items,
		isPopover,
		popoverLabel,
		popoverClassName,
	} = useContext(RepeaterContext);

	const repeaterItemActionsProps = {
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
				popoverClassName={popoverClassName}
				className={controlInnerClassNames(
					'repeater-item-group',
					item?.__className
				)}
				header={
					!RepeaterItemHeader ? (
						<>
							<div
								className={controlInnerClassNames(
									'repeater-group-header'
								)}
								onClick={(event) =>
									isOpenPopoverEvent(event) &&
									setOpen(!isOpen)
								}
							>
								{__('Item ', 'publisher') + itemId}
							</div>
							<RepeaterItemActions
								{...repeaterItemActionsProps}
							/>
						</>
					) : (
						<>
							<RepeaterItemHeader
								{...repeaterItemActionsProps}
							></RepeaterItemHeader>
							<RepeaterItemActions
								{...repeaterItemActionsProps}
							/>
						</>
					)
				}
				children={<RepeaterItemChildren {...{ item, itemId }} />}
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
