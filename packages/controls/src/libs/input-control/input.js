/**
 * External dependencies
 */
import {
	TextControl as WPTextControl,
	__experimentalUnitControl as WPUnitControl,
} from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { isEmpty, isString, isUndefined } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { RangeControl, BaseControl } from './../index';
import { getCSSUnits, isSpecialUnit } from './utils';
import { useControlContext } from '../../context';

export function InputControl({
	unitType,
	units,
	range,
	noBorder, //
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field, //
	className,
	...props
}) {
	const { value, setValue } = useControlContext({
		id,
		defaultValue,
		onChange,
		mergeInitialAndDefault: true,
	});

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
			<div
				className={controlClassNames(
					'input',
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

				{!isEmpty(units) ? (
					<WPUnitControl
						{...props}
						units={units}
						value={value}
						onChange={setValue}
						className={controlClassNames(
							'text',
							'publisher-control-unit',
							className
						)}
						isUnitSelectTabbable={false}
					/>
				) : (
					<WPTextControl
						{...props}
						value={value}
						onChange={setValue}
						className={controlClassNames('text', className)}
					/>
				)}
			</div>
		</BaseControl>
	);
}

InputControl.propTypes = {
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

InputControl.defaultProps = {
	range: false,
	noBorder: false,
	field: 'input',
};
