/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { RangeControl as WordPressRangeControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { Field } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';

export default function RangeControl({
	min,
	max,
	initialPosition,
	withInputField,
	className,
	//
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field,
	//
}) {
	const { value, setValue } = useControlContext({
		id,
		defaultValue,
		onChange,
	});

	return (
		<Field
			label={label}
			field={field}
			columns={columns}
			className={className}
		>
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
		</Field>
	);
}

RangeControl.propTypes = {
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
	withInputField: true,
	field: 'range',
};
