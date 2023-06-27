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
import { isEmpty, isUndefined, useValue } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { RangeControl } from './../index';
import { getCSSUnits, isSpecialUnit } from './utils';

export function InputControl({
	unitType,
	units,
	range,
	noBorder,
	//
	value: initialValue,
	defaultValue,
	onChange,
	//
	className,
	...props
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
	});

	if ((isUndefined(units) || isEmpty(units)) && unitType !== '') {
		units = getCSSUnits(unitType);
	}

	return (
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
					withInputField={false}
					className={className}
					value={value}
					onChange={(newValue) => {
						// extract unit from old value and assign it to newValue
						newValue = newValue + value.replace(/[0-9|-]/gi, '');
						setValue(newValue);
						return newValue;
					}}
					//
					{...props}
				/>
			)}

			{units && (
				//todo replace this with our UnitControl (there is strange bug about half units list!)
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
			)}

			{!units && (
				<WPTextControl
					{...props}
					value={value}
					onChange={setValue}
					className={controlClassNames('text', className)}
				/>
			)}
		</div>
	);
}

InputControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onValueChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * The current value.
	 */
	value: PropTypes.string,
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
	unitType: '',
	range: false,
	noBorder: false,
};
