/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { memo, useContext, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ActionsUI from './actions-ui';
import { RepeaterContext } from '../context';
import GroupControl from '../../group-control';
import { controlInnerClassNames } from '@publisher/classnames';

const RepeaterItem = ({ item, itemId }) => {
	const [isOpen, setOpen] = useState(false);
	const [isVisible, setVisibility] = useState(true);
	const {
		InnerComponents,
		Header,
		sortItems,
		repeaterItems: items,
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
				isDraggable
				groupId={itemId}
				dropArgs={items}
				dropCallback={sortItems}
				className={`group${isVisible ? ' activate' : ' deactivate'}`}
				header={
					!Header ? (
						<>
							{__('Item ', 'publisher') + itemId}
							<ActionsUI {...{ ...actionsProps }} />
						</>
					) : (
						<Header {...{ item, itemId }}>
							<ActionsUI {...{ ...actionsProps }} />
						</Header>
					)
				}
				children={<InnerComponents {...{ item, itemId }} />}
				isOpen={isOpen}
				isPopover={true}
			/>
		</div>
	);
};

export default memo(RepeaterItem);
