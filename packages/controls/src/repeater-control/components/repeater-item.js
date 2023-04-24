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

const RepeaterItem = ({ item, itemId }) => {
	const [isOpen, setOpen] = useState(false);
	const [isVisible, setVisibility] = useState(true);
	const { InnerComponents, Header } = useContext(RepeaterContext);

	const actionsProps = {
		itemId,
		isOpen,
		setOpen,
		isVisible,
		setVisibility,
	};

	return (
		<GroupControl
			className={isVisible ? 'group activate' : 'group deactivate'}
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
		/>
	);
};

export default memo(RepeaterItem);
