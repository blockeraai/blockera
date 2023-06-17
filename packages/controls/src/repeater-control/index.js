/**
 * Publisher dependencies
 */
import { useState } from '@wordpress/element';
import { Button } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies.
 */
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';
import LabelControl from '../label-control';
import PlusIcon from './icons/plus';

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
	repeaterItemsPopoverClassName = '',
	...props
}) => {
	const [repeaterItems, setRepeaterItems] = useState(
		value?.length ? value : []
	);

	const defaultRepeaterState = {
		repeaterAttribute: attribute,
		design,
		Header,
		clientId,
		initialState,
		repeaterItems,
		InnerComponents,
		cloneItem: () => {
			const _repeaterItems = [
				...repeaterItems,
				...repeaterItems.slice(-1),
			];

			setRepeaterItems(_repeaterItems);
			updateBlockAttributes(_repeaterItems);
		},
		addNewItem: () => {
			const _repeaterItems = [...repeaterItems, ...[initialState]];

			setRepeaterItems(_repeaterItems);
			updateBlockAttributes(_repeaterItems);
		},
		removeItem: (itemId) => {
			const _repeaterItems = repeaterItems.filter(
				(i, index) => index !== itemId
			);

			setRepeaterItems(_repeaterItems);
			updateBlockAttributes(_repeaterItems);
		},
		changeItem: (itemId, newValue) => {
			const _repeaterItems = repeaterItems.map((i, id) => {
				if (id === itemId) {
					return newValue;
				}

				return i;
			});

			setRepeaterItems(_repeaterItems);
			updateBlockAttributes(_repeaterItems);
		},
		sortItems: (newValue) => {
			const arrayMove = ({ args, toIndex, fromIndex }) => {
				const newArr = [...args];
				const [removed] = newArr.splice(fromIndex, 1);
				newArr.splice(toIndex, 0, removed);

				return newArr;
			};

			const _repeaterItems = arrayMove(newValue);

			setRepeaterItems(_repeaterItems);
			updateBlockAttributes(_repeaterItems);
		},
		isPopover,
		popoverLabel,
		customProps: { ...props },
		repeaterItemsPopoverClassName,
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
