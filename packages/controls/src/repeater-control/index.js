/**
 * WordPress dependencies.
 */
import { plus } from '@wordpress/icons';
import { useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import { useImmerReducer } from 'use-immer';

/**
 * Internal dependencies.
 */
import classnames from '@publisher/classnames';
import repeaterItemsReducer from './store/reducer';
import { RepeaterContextProvider } from './context';
import { Button, Icon } from '@publisher/components';
import MappedItems from './components/mapped-items';
import { addItem, removeItem, changeItem } from './store/actions';

//CSS dependencies
import './style.scss';

const RepeaterControl = ({
	label,
	clientId,
	savedItems,
	InnerComponents,
	initialState = {},
	className = 'repeater',
	updateBlockAttributes = () => {},
}) => {
	const [repeaterItems, dispatch] = useImmerReducer(
		repeaterItemsReducer,
		initialState
	);

	useEffect(() => {
		if (savedItems !== repeaterItems) {
			updateBlockAttributes(repeaterItems);
		}
	}, [repeaterItems, updateBlockAttributes]);

	const defaultRepeaterState = {
		clientId,
		dispatch,
		initialState,
		repeaterItems,
		InnerComponents,
		addNewItem: () => dispatch(addItem(initialState)),
		removeItem: (itemId) => dispatch(removeItem(itemId)),
		changeItem: (itemId, value) => dispatch(changeItem(itemId, value)),
	};

	return (
		<RepeaterContextProvider {...defaultRepeaterState}>
			<div className={classnames('control', className)}>
				<MappedItems items={repeaterItems} />
				<Button
					className="add-new-item"
					onClick={defaultRepeaterState.addNewItem}
				>
					<Icon type="wp" icon={plus} size={17} />
					{label}
				</Button>
			</div>
		</RepeaterContextProvider>
	);
};

export default RepeaterControl;
