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
import { controlClassNames } from '@publisher/classnames';
import repeaterItemsReducer from './store/reducer';
import { RepeaterContextProvider } from './context';
import { Button, Icon } from '@publisher/components';
import MappedItems from './components/mapped-items';
import { addItem, removeItem, changeItem, sortItems } from './store/actions';

//CSS dependencies
import './style.scss';

const RepeaterControl = ({
	label,
	value,
	Header,
	clientId,
	InnerComponents,
	initialState = {},
	className,
	updateBlockAttributes = () => {},
}) => {
	const [repeaterItems, dispatch] = useImmerReducer(
		repeaterItemsReducer,
		value?.length ? value : [initialState]
	);

	useEffect(() => {
		if (value !== repeaterItems) {
			updateBlockAttributes(repeaterItems);
		}
	}, [repeaterItems, value, updateBlockAttributes]);

	const defaultRepeaterState = {
		Header,
		clientId,
		dispatch,
		initialState,
		repeaterItems,
		InnerComponents,
		addNewItem: () => dispatch(addItem(initialState)),
		removeItem: (itemId) => dispatch(removeItem(itemId)),
		changeItem: (itemId, newValue) =>
			dispatch(changeItem(itemId, newValue)),
		sortItems: (newValue) => dispatch(sortItems(newValue)),
	};

	return (
		<RepeaterContextProvider {...defaultRepeaterState}>
			<div className={controlClassNames('repeater', className)}>
				<MappedItems />
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
