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
import VisibleElement from './visible-element';
import GroupControl from '../../group-control';

const RepeaterItem = ({ item, itemId }) => {
	const [isOpen, setOpen] = useState(false);
	const [isVisible, setVisibility] = useState(true);
	const { InnerComponents } = useContext(RepeaterContext);

	return (
		<GroupControl
			className={isVisible ? 'group activate' : 'group deactivate'}
		>
			{!InnerComponents && (
				<>
					<div className="header">
						<div className="header-label">
							{__('Item ', 'publisher') + itemId}
							<VisibleElement {...{ setVisibility, isVisible }} />
							<ActionsUI {...{ itemId, setOpen, isOpen }} />
						</div>
					</div>
					{isOpen && (
						<div className="content" {...{ item, itemId }}>
							{`Item ${itemId}`}
						</div>
					)}
				</>
			)}

			{InnerComponents && (
				<InnerComponents
					{...{
						item,
						itemId,
						ActionsUI,
						isVisible,
						setVisibility,
						VisibleElement,
					}}
				/>
			)}
		</GroupControl>
	);
};

export default memo(RepeaterItem);
