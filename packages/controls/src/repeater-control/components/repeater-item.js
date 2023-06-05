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
import GroupControl from '../../group-control';

const RepeaterItem = ({ item, itemId, repeaterAttribute }) => {
	const [isOpen, setOpen] = useState(false);
	const [isVisible, setVisibility] = useState(true);
	const {
		design,
		InnerComponents,
		Header: CustomHeader,
		sortItems,
		repeaterItems: items,
		isPopover,
	} = useContext(RepeaterContext);
	const actionsProps = {
		itemId,
		isOpen,
		setOpen,
		isVisible,
		setVisibility,
	};

	return (
		<div className={controlInnerClassNames('repeater-item')}>
			<GroupControl
				isDraggable={true}
				design={design}
				groupId={itemId}
				dropArgs={items}
				dropCallback={sortItems}
				className={controlInnerClassNames('repeater-item-group')}
				header={
					!CustomHeader ? (
						<div
							className={controlInnerClassNames(
								'repeater-group-header'
							)}
							onClick={() => setOpen(!isOpen)}
						>
							{__('Item ', 'publisher') + itemId}
							<ActionsUI {...{ ...actionsProps }} />
						</div>
					) : (
						<CustomHeader {...{ item, itemId, isOpen, setOpen }}>
							<ActionsUI {...{ ...actionsProps }} />
						</CustomHeader>
					)
				}
				children={
					<InnerComponents {...{ item, itemId, repeaterAttribute }} />
				}
				isOpen={isOpen}
				isVisible={isVisible}
				isPopover={isPopover}
			/>
		</div>
	);
};

export default memo(RepeaterItem);
