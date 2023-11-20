/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { useMemo } from '@wordpress/element';
/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { isEmpty, isUndefined, isNumber } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { BaseControl } from './../index';
import { getCSSUnits } from './utils';
import { useControlContext } from '../../context';

export function PublisherInputControl({
	unitType,
	units,
	noBorder, //
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field, //
	className,
	type = 'text',
	min,
	max,
	...props
}) {
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

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			{isEmpty(units) ? (
				<input
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className={controlClassNames('single-input', className)}
					type={type}
					{...(getMinValue && getMinValue)}
					{...(getMaxValue && getMaxValue)}
					{...props}
				/>
			) : (
				<div className={controlClassNames('unit-input-container')}>
					<input
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className={controlClassNames('single-input', className)}
						type={type}
						{...(getMinValue && getMinValue)}
						{...(getMaxValue && getMaxValue)}
						{...props}
					/>
					<select className={controlClassNames('unit-select')}>
						{units.map((unit, key) => (
							<option key={key} value={unit?.value}>
								{unit?.label}
							</option>
						))}
					</select>
				</div>
			)}
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
};

PublisherInputControl.defaultProps = {
	range: false,
	noBorder: false,
	field: 'input',
};
