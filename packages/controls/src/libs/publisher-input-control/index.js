/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { isEmpty, isNumber, isString, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';
import { BaseControl, RangeControl } from './../index';
import { UnitInput } from './UnitInput';
import { Input } from './input';
import { getCSSUnits } from './utils';

export function PublisherInputControl({
	unitType,
	units,
	noBorder, //
	id,
	range,
	label,
	columns,
	defaultValue,
	onChange,
	field, //
	className,
	type = 'text',
	min,
	max,
	validator,
	disabled = false,
	...props
}) {
	/**
	 * value: {
	 * 	inputValue: string,
	 * 	type: string | number
	 * 	oldInputValue: string | number
	 * 	oldUnit: string
	 *  unit: string
	 *  isSpecial: true | false
	 * }
	 *
	 */
	const { value, setValue } = useControlContext({
		id,
		defaultValue,
		onChange,
	});

	// add css units
	if (unitType !== '' && (isUndefined(units) || isEmpty(units))) {
		units = getCSSUnits(unitType);
	}

	// get the minimum value in number type
	const getMinValue = useMemo(() => {
		if (type === 'number' && !isUndefined(min) && isNumber(+min)) {
			return { min };
		}
		return {};
	}, [min]); // eslint-disable-line

	// get the maximum value in number type
	const getMaxValue = useMemo(() => {
		if (type === 'number' && !isUndefined(max) && isNumber(+max)) {
			return { max };
		}
		return {};
	}, [max]); // eslint-disable-line

	console.log('value:', value);

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			<div
				className={controlClassNames(
					'input-2',
					range && 'input-range',
					noBorder && 'no-border',
					value?.isSpecial && 'publisher-control-unit-special',
					className
				)}
			>
				{range && (
					<RangeControl
						id={id}
						withInputField={false}
						className={className}
						onChange={(newValue) => {
							// extract unit from old value and assign it to newValue
							if (isString(value)) {
								newValue =
									newValue + value.replace(/[0-9|-]/gi, '');
							}
							const updatedObject = {
								...value,
								inputValue: newValue,
							};
							console.log('object:', updatedObject);
							setValue(updatedObject);
						}}
						{...props}
					/>
				)}
				{isEmpty(units) ? (
					<Input
						value={value}
						setValue={setValue}
						type={type}
						getMaxValue={getMaxValue}
						getMinValue={getMinValue}
						noBorder={noBorder}
						className={className}
						disabled={disabled}
						validator={validator}
						{...props}
					/>
				) : (
					<UnitInput
						units={units}
						value={value}
						setValue={setValue}
						type={type}
						noBorder={noBorder}
						className={className}
						isSpecial={value?.isSpecial}
						disabled={disabled}
						validator={validator}
						{...props}
					/>
				)}
			</div>
		</BaseControl>
	);
}

PublisherInputControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Sets to show range control for input or not
	 */
	range: PropTypes.bool,
	/**
	 * Type of CSS units from presets
	 */
	unitType: PropTypes.oneOf([
		'outline',
		'text-shadow',
		'box-shadow',
		'background-size',
		'letter-spacing',
		'text-indent',
		'background-position',
		'duration',
		'angle',
		'percent',
		'width',
		'essential',
		'general',
		'custom',
	]),
	/**
	 * Indicates units for showing unit for value.
	 */
	units: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string,
			default: PropTypes.number,
		})
	),
	/**
	 * By using this you can prevent the control to show the border and outline shape.
	 */
	noBorder: PropTypes.bool,
	/**
	 * By using this you can disable the control.
	 */
	disabled: PropTypes.bool,
	/**
	 * The minimum `value` allowed.
	 */
	min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * The maximum `value` allowed.
	 */
	max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * check the `input`,  A function used to validate input values.
	 */
	validator: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.arrayOf(
			PropTypes.oneOf([
				'calc',
				'max',
				'min',
				'translate',
				'scale',
				'rotate',
				'rgb',
				'rgba',
				'hsl',
				'hsla',
				'skew',
				'var',
				'attr',
			])
		),
	]),
};

PublisherInputControl.defaultProps = {
	range: false,
	noBorder: false,
	field: 'input',
};
