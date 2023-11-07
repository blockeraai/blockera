/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { RangeControl as WordPressRangeControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { isString } from '@publisher/utils';
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';

function valueCleanup(value) {
	if (isString(value)) {
		const regexp = new RegExp('[a-zA-Z]|[^A-Za-z0-9]', 'gi');

		return Number(value.replace(regexp, ''));
	}

	return value;
}

export default function RangeControl({
	min,
	max,
	className,
	withInputField,
	initialPosition,
	//
	id,
	label,
	field,
	columns,
	onChange,
	sideEffect,
	defaultValue,
	//
}) {
	let { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
		valueCleanup,
	});

	if (isString(value)) {
		value = valueCleanup(value);
	}

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			<WordPressRangeControl
				min={min}
				max={max}
				initialPosition={initialPosition}
				value={value}
				onChange={(newValue) => {
					if (sideEffect) {
						setValue(newValue);

						return false;
					}

					onChange(newValue);
				}}
				className={controlClassNames('range', className)}
				withInputField={withInputField}
				__nextHasNoMarginBottom={false}
			/>
		</BaseControl>
	);
}

RangeControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * Label for field. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	label: PropTypes.string,
	/**
	 * Field id for passing into child Field component
	 *
	 * @default "toggle-select"
	 */
	field: PropTypes.string,
	/**
	 * Columns setting for Field grid.
	 *
	 * @default "columns-2"
	 */
	columns: PropTypes.string,
	/**
	 * if when sideEffect is true calling setValue to modify value of context provider,
	 * else just calling onChange handler!
	 *
	 * @default true
	 */
	sideEffect: PropTypes.bool,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
	field: 'range',
	sideEffect: true,
	withInputField: true,
};
