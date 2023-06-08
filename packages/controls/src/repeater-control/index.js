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
	popoverLabel,
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
		changeItem: (itemId, newValue) => {
			dispatch(changeItem(itemId, newValue));

			updateBlockAttributes(repeaterItems);
		},
		sortItems: (newValue) => dispatch(sortItems(newValue)),
		isPopover,
		popoverLabel,
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
