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
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import repeaterItemsReducer from './store/reducer';
import { RepeaterContextProvider } from './context';
import { Button, Icon } from '@publisher/components';
import MappedItems from './components/mapped-items';
import { addItem, removeItem, changeItem, sortItems } from './store/actions';

//CSS dependencies
import './style.scss';
import LabelControl from '../label-control';

const RepeaterControl = ({
	design = 'minimal',
	label,
	value,
	Header,
	clientId,
	InnerComponents,
	initialState = {},
	className,
	isPopover = true,
	updateBlockAttributes = () => {},
}) => {
	const [repeaterItems, dispatch] = useImmerReducer(
		repeaterItemsReducer,
		value?.length ? value : []
	);

	useEffect(() => {
		if (value !== repeaterItems) {
			updateBlockAttributes(repeaterItems);
		}
	}, [repeaterItems, value, updateBlockAttributes]);

	const defaultRepeaterState = {
		design,
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
		isPopover,
	};

	return (
		<RepeaterContextProvider {...defaultRepeaterState}>
			<div
				className={controlClassNames(
					'repeater',
					'design-' + design,
					className
				)}
			>
				<div className={controlInnerClassNames('header')}>
					<LabelControl label={label} />

					<Button
						className={controlInnerClassNames('btn-add')}
						onClick={defaultRepeaterState.addNewItem}
					>
						<Icon type="wp" icon={plus} size={17} />
					</Button>
				</div>
				<MappedItems />
			</div>
		</RepeaterContextProvider>
	);
};

export default RepeaterControl;
