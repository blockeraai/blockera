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
 * Publisher dependencies
 */
import { Button } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies.
 */
import repeaterItemsReducer from './store/reducer';
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';
import { addItem, removeItem, changeItem, sortItems } from './store/actions';
import LabelControl from '../label-control';
import PlusIcon from './icons/plus';

//CSS dependencies
import './style.scss';

const RepeaterControl = ({
	attribute,
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
		repeaterAttribute: attribute,
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
						size="extra-small"
						className={controlInnerClassNames('btn-add')}
						onClick={defaultRepeaterState.addNewItem}
					>
						<PlusIcon />
					</Button>
				</div>
				<MappedItems />
			</div>
		</RepeaterContextProvider>
	);
};

export default RepeaterControl;
