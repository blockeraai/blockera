/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from '@wordpress/element';
/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import {
	isEmpty,
	isUndefined,
	isNumber,
	isFunction,
	isArray,
	isString,
} from '@publisher/utils';

/**
 * Internal dependencies
 */
import {
	getCSSUnits,
	checkCSSFunctions,
	isSpecialUnit,
	extractNumber,
} from './utils';
import { useControlContext } from '../../context';
import { RangeControl, BaseControl } from './../index';

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
	...props
}) {
	const { value, setValue } = useControlContext({
		id,
		defaultValue,
		onChange,
	});

	console.log('value:', value);
	const [isValidValue, setIsValidValue] = useState(true);
	const [selectedUnit, setSelectedUnit] = useState('');

	// add css units
	if (unitType !== '' && (isUndefined(units) || isEmpty(units))) {
		units = getCSSUnits(unitType);
	}

	// get the minimum value in number type
	const getMinValue = useMemo(() => {
		if (type === 'number' && !isUndefined(min) && isNumber(+min)) {
			return { min };
		}
	}, [type, min]);

	// get the maximum value in number type
	const getMaxValue = useMemo(() => {
		if (type === 'number' && !isUndefined(max) && isNumber(+max)) {
			return { max };
		}
	}, [type, max]);

	// add css units
	if (unitType !== '' && (isUndefined(units) || isEmpty(units))) {
		units = getCSSUnits(unitType);
	}

	// validator checking
	useEffect(() => {
		if (!validator || type !== 'text') {
			// If no validator is provided, assume the value is valid
			setIsValidValue(true);
			return;
		}

		let isValid = false;
		if (isFunction(validator)) {
			isValid = validator(value);
		} else if (isArray(validator)) {
			isValid = checkCSSFunctions(validator, value);
		}

		// Update validValue based on the result of validation
		setIsValidValue(!!isValid);
	}, [value]); // eslint-disable-line

	// get unit type and set it
	useEffect(() => {
		if (
			!isUndefined(units) &&
			!isEmpty(units) &&
			isEmpty(selectedUnit) &&
			units.length
		) {
			setSelectedUnit(units[0]?.value);
		}
	}, [units]); //eslint-disable-line

	// set unit to value after unit changed
	useEffect(() => {
		if (type === 'number') {
			const newValue = extractNumber(value);
			setValue(`${newValue}${selectedUnit}`);
		}
	}, [selectedUnit]); //eslint-disable-line

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
					isSpecialUnit(value) && 'publisher-control-unit-special',
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
							if (isString(value))
								newValue =
									newValue + value.replace(/[0-9|-]/gi, '');
							setValue(newValue);
						}}
						{...props}
					/>
				)}
				{isEmpty(units) ? (
					<input
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className={controlClassNames(
							'single-input',
							!isValidValue && 'invalid',
							noBorder && 'no-border',
							className
						)}
						type={type}
						{...(getMinValue && getMinValue)}
						{...(getMaxValue && getMaxValue)}
						{...props}
					/>
				) : (
					<div className={controlClassNames('unit-input-container')}>
						<input
							value={extractNumber(value)}
							onChange={(e) =>
								setValue(`${e.target.value}${selectedUnit}`)
							}
							className={controlClassNames(
								'single-input',
								!isValidValue && 'invalid',
								noBorder && 'no-border',
								className
							)}
							type={type}
							{...(getMinValue && getMinValue)}
							{...(getMaxValue && getMaxValue)}
							{...props}
						/>
						<select
							onChange={(e) => setSelectedUnit(e.target.value)}
							className={controlClassNames('unit-select')}
						>
							{units.map((unit, key) => (
								<option key={key} value={unit?.value}>
									{unit?.label}
								</option>
							))}
						</select>
					</div>
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
	 * The minimum `value` allowed.
	 */
	min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * The maximum `value` allowed.
	 */
	max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	/**
	 * Disables the `input`, preventing new values from being applied.
	 */
	disabled: PropTypes.bool,
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
