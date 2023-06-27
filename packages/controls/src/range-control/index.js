/**
 * WordPress dependencies
 */
import { RangeControl as WordPressRangeControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import PropTypes from 'prop-types';
import { useValue } from '@publisher/utils';

export default function RangeControl({
	min,
	max,
	initialPosition,
	withInputField,
	value: initialValue,
	defaultValue,
	onChange,
	className,
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
	});

	return (
		<WordPressRangeControl
			min={min}
			max={max}
			initialPosition={initialPosition}
			value={value}
			onChange={setValue}
			className={controlClassNames('range', className)}
			withInputField={withInputField}
			__nextHasNoMarginBottom={false}
		/>
	);
}

RangeControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.number,
	/**
	 * The current value.
	 */
	value: PropTypes.number,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * The minimum `value` allowed.
	 */
	min: PropTypes.number,
	/**
	 * The maximum `value` allowed.
	 */
	max: PropTypes.number,
	/**
	 * Passed as a prop to the `NumberControl` component and is only
	 * applicable if `withInputField` and `isShiftStepEnabled` are both true
	 * and while the number input has focus. Acts as a multiplier of `step`.
	 */
	withInputField: PropTypes.bool,
	/**
	 * The slider starting position, used when no `value` is passed.
	 * The `initialPosition` will be clamped between the provided `min`
	 * and `max` prop values.
	 */
	initialPosition: PropTypes.number,
};

RangeControl.defaultProps = {
	withInputField: true,
};
