/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';
import { Button } from '@publisher/components';
import { isUndefined } from '@publisher/utils';
import { prepare } from '@publisher/data-extractor';

/**
 * Internal dependencies.
 */
import PlusIcon from './icons/plus';
import LabelControl from '../label-control';
import { useControlContext } from '../context';
import { RepeaterContextProvider } from './context';
import MappedItems from './components/mapped-items';
import useControlEffect from '../context/hooks/use-control-effect';

export default function RepeaterControl({
	design,
	mode,
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
	repeaterId,
	repeaterItemHeader,
	repeaterItemChildren,
	//
	defaultValue,
	defaultRepeaterItemValue,
	onChange,
	valueCleanup,
	//
	className,
	...props
}) {
	const {
		value,
		dispatch: { addRepeaterItem },
		controlInfo: { name: controlId },
	} = useControlContext({
		defaultValue,
		repeater: {
			repeaterId,
			defaultRepeaterItemValue,
		},
		mergeInitialAndDefault: true,
	});

	const repeaterItems = isUndefined(repeaterId)
		? value
		: prepare(repeaterId, value);

	//Call onChange function if is set valueCleanup as function to clean value else set all value details into parent state!
	useControlEffect({
		onChange,
		valueCleanup,
		value: repeaterItems,
		dependencies: [repeaterItems],
	});

	const defaultRepeaterState = {
		design,
		mode,
		popoverLabel: popoverLabel || label,
		popoverClassName,
		maxItems,
		minItems,
		actionButtonAdd,
		actionButtonVisibility,
		actionButtonDelete,
		actionButtonClone,
		//
		controlId,
		repeaterId,
		repeaterItemHeader,
		repeaterItemChildren,
		//
		defaultRepeaterItemValue,
		repeaterItems, // value
		//
		customProps: { ...props },
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
									) {
										addRepeaterItem({
											controlId,
											repeaterId,
											value: defaultRepeaterItemValue,
										});
									}
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
	// /**
	//  * Function that will be fired while the control value state changes.
	//  */
	// onChange: PropTypes.func,
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
	mode: PropTypes.oneOf(['popover', 'accordion']),
	/**
	 * Specifies the popover title if `mode` was `popover`. by default the repeater label will be shown as popover title.
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
		PropTypes.func,
		PropTypes.object,
	]),
	/**
	 * Children components for each repeater item
	 */
	repeaterItemChildren: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
		PropTypes.func,
		PropTypes.object,
	]),
};

RepeaterControl.defaultProps = {
	defaultValue: [],
	defaultRepeaterItemValue: { isVisible: true },
	design: 'minimal',
	mode: 'popover',
	maxItems: -1,
	minItems: 0,
	actionButtonAdd: true,
	actionButtonVisibility: true,
	actionButtonDelete: true,
	actionButtonClone: true,
	injectHeaderButtonsStart: '',
	injectHeaderButtonsEnd: '',
};
