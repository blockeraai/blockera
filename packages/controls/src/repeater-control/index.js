/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { Button } from '@publisher/components';
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { useValue } from '@publisher/utils';

/**
 * Internal dependencies.
 */
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';
import LabelControl from '../label-control';
import PlusIcon from './icons/plus';

export default function RepeaterControl({
	design,
	isPopover,
	popoverLabel,
	popoverClassName,
	maxItems,
	minItems,
	actionButtonAdd,
	actionButtonVisibility,
	actionButtonDelete,
	actionButtonClone,
	injectHeaderButtonsStart,
	injectHeaderButtonsEnd,
	//
	label,
	repeaterItemHeader,
	repeaterItemChildren,
	//
	value: initialValue,
	defaultValue,
	defaultRepeaterItemValue,
	onChange,
	valueCleanup,
	//
	className,
	...props
}) {
	const { value: repeaterItems, setValue: setRepeaterItems } = useValue({
		initialValue,
		defaultValue,
		onChange,
		valueCleanup,
	});

	const defaultRepeaterState = {
		design,
		isPopover,
		popoverLabel: popoverLabel || label,
		popoverClassName,
		maxItems,
		minItems,
		actionButtonAdd,
		actionButtonVisibility,
		actionButtonDelete,
		actionButtonClone,
		//
		repeaterItemHeader,
		repeaterItemChildren,
		//
		defaultRepeaterItemValue,
		repeaterItems, // value
		//
		customProps: { ...props },
		//
		cloneItem: () => {
			if (maxItems !== -1 && repeaterItems?.length >= maxItems) {
				return;
			}

			const _repeaterItems = [
				...repeaterItems,
				...repeaterItems.slice(-1),
			];

			setRepeaterItems(_repeaterItems);
		},
		addNewItem: () => {
			if (maxItems !== -1 && repeaterItems?.length >= maxItems) {
				return;
			}

			const _repeaterItems = [
				...repeaterItems,
				...[defaultRepeaterItemValue],
			];

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

					<div
						className={controlInnerClassNames(
							'repeater-header-action-buttons'
						)}
					>
						{injectHeaderButtonsStart}

						{actionButtonAdd && (
							<Button
								size="extra-small"
								className={controlInnerClassNames('btn-add')}
								{...(maxItems !== -1 &&
								repeaterItems?.length >= maxItems
									? { disabled: true }
									: {})}
								aria-label={__('Add New', 'publisher-core')}
								onClick={() => {
									if (
										maxItems === -1 ||
										repeaterItems?.length < maxItems
									)
										defaultRepeaterState.addNewItem();
								}}
							>
								<PlusIcon />
							</Button>
						)}

						{injectHeaderButtonsEnd}
					</div>
				</div>
				<MappedItems />
			</div>
		</RepeaterContextProvider>
	);
}

RepeaterControl.propTypes = {
	/**
	 * It sets the default value of repeater. Please note for defining the value of repeater items you have to use `defaultRepeaterItemValue`
	 */
	defaultValue: PropTypes.array,
	/**
	 * The current value of control
	 */
	value: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Function that runs before firing onChange. You can use it cleanup values
	 */
	valueCleanup: PropTypes.func,
	/**
	 * It sets the default of each repeater item.
	 */
	defaultRepeaterItemValue: PropTypes.object,
	/**
	 * It specifies the design of repeater control.
	 */
	design: PropTypes.oneOf(['minimal']),
	/**
	 * Specifies that repeater item should use popover or accordion
	 *
	 * @default true
	 */
	isPopover: PropTypes.bool,
	/**
	 * Specifies the popover title if `isPopover` was true. by default the repeater label will be shown as popover title.
	 */
	popoverLabel: PropTypes.string,
	/**
	 * Specifies custom css classes that should be added to popover
	 *
	 * @default true
	 */
	popoverClassName: PropTypes.string,
	/**
	 * Specifies maximum number of repeater items. -1 means unlimited.
	 *
	 * @default -1
	 */
	maxItems: PropTypes.number,
	/**
	 * Specifies minimum number of repeater items.
	 *
	 * @default 0
	 */
	minItems: PropTypes.number,
	/**
	 * Specifies the add button should be shown for repeater items.
	 *
	 * @default true
	 */
	actionButtonAdd: PropTypes.bool,
	/**
	 * Specifies the visibility or activation control should be shown for repeater items.
	 *
	 * @default true
	 */
	actionButtonVisibility: PropTypes.bool,
	/**
	 * Specifies delete or remove control should be shown for repeater items.
	 *
	 * @default true
	 */
	actionButtonDelete: PropTypes.bool,
	/**
	 * Specifies clone or copy control should be shown for repeater items.
	 *
	 * @default true
	 */
	actionButtonClone: PropTypes.bool,
	/**
	 * A placeholder that you can use inject items at the beginning of header buttons.
	 */
	injectHeaderButtonsStart: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
	]),
	/**
	 * A placeholder that you can use inject items after header buttons.
	 */
	injectHeaderButtonsEnd: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
	]),
	/**
	 * Header component for each repeater item
	 */
	repeaterItemHeader: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
	]),
	/**
	 * Children components for each repeater item
	 */
	repeaterItemChildren: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
	]),
};

RepeaterControl.defaultProps = {
	defaultValue: [],
	defaultRepeaterItemValue: { isVisible: true },
	design: 'minimal',
	isPopover: true,
	maxItems: -1,
	minItems: 0,
	actionButtonAdd: true,
	actionButtonVisibility: true,
	actionButtonDelete: true,
	actionButtonClone: true,
	injectHeaderButtonsStart: '',
	injectHeaderButtonsEnd: '',
};
