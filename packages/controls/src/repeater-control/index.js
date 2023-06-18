/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { Button } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { useLateEffect } from '@publisher/utils';

/**
 * Internal dependencies.
 */
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';
import LabelControl from '../label-control';
import PlusIcon from './icons/plus';

const RepeaterControl = ({
	design = 'minimal',
	popoverLabel,
	label,
	value,
	Header,
	clientId,
	InnerComponents,
	initValue = {},
	className,
	isPopover = true,
	onValueChange = (newValue) => {
		return newValue;
	},
	repeaterItemsPopoverClassName = '',
	...props
}) => {
	const [repeaterItems, setRepeaterItems] = useState(
		value?.length ? value : []
	);

	useLateEffect(() => {
		onValueChange(repeaterItems);
	}, [repeaterItems]);

	const defaultRepeaterState = {
		design,
		Header,
		clientId,
		initValue,
		repeaterItems,
		InnerComponents,
		cloneItem: () => {
			const _repeaterItems = [
				...repeaterItems,
				...repeaterItems.slice(-1),
			];

			setRepeaterItems(_repeaterItems);
		},
		addNewItem: () => {
			const _repeaterItems = [...repeaterItems, ...[initValue]];

			setRepeaterItems(_repeaterItems);
		},
		removeItem: (itemId) => {
			const _repeaterItems = repeaterItems.filter(
				(i, index) => index !== itemId
			);

			setRepeaterItems(_repeaterItems);
		},
		changeItem: (itemId, newValue) => {
			const _repeaterItems = repeaterItems.map((i, id) => {
				if (id === itemId) {
					return newValue;
				}

				return i;
			});

			setRepeaterItems(_repeaterItems);
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
