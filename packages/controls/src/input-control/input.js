/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import {
	TextControl as WPTextControl,
	__experimentalUnitControl as WPUnitControl,
} from '@wordpress/components';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { RangeControl } from './../index';

export function InputControl({
	units,
	range = false,
	noBorder = false,
	// suffix = '',  //todo implement
	//
	value = null,
	initValue,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = () => {},
	...props
}) {
	const [controlValue, setValue] = useState(value || initValue);

	return (
		<div
			className={controlClassNames(
				'input',
				range ? 'input-range' : '',
				className
			)}
		>
			{range && (
				<RangeControl
					withInputField={false}
					className={className}
					value={controlValue}
					onChange={(newValue) => {
						// extract unit from old value and assign it to newValue
						newValue =
							newValue + controlValue.replace(/[0-9|-]/gi, '');

						newValue = onChange(newValue);
						setValue(newValue);
						onValueChange(newValue);
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
					value={controlValue}
					onChange={(newValue) => {
						newValue = onChange(newValue);
						setValue(newValue);
						onValueChange(newValue);
						return newValue;
					}}
					className={controlClassNames(
						'text',
						'publisher-control-unit',
						noBorder && 'no-border',
						className
					)}
					isUnitSelectTabbable={false}
				/>
			)}

			{!units && (
				<WPTextControl
					{...props}
					value={controlValue}
					onChange={(newValue) => {
						newValue = onChange(newValue);
						setValue(newValue);
						onValueChange(newValue);
						return newValue;
					}}
					className={controlClassNames(
						'text',
						noBorder && 'no-border',
						className
					)}
				/>
			)}
		</div>
	);
}

InputControl.propTypes = {
	range: PropTypes.bool,
	units: PropTypes.array,
	value: PropTypes.string,
	noBorder: PropTypes.bool,
	onChange: PropTypes.func,
	initValue: PropTypes.string,
	className: PropTypes.string,
	onValueChange: PropTypes.func,
};
