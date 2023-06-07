/**
 * WordPress dependencies
 */
import {
	TextControl as WPTextControl,
	__experimentalUnitControl as WPUnitControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Styles
 */
import './style.scss';
import { RangeControl } from './../index';

export function InputControl({
	initValue,
	units,
	// suffix = '',  //todo implement
	range = false,
	//
	value,
	//
	className,
	onValueChange = () => {},
	...props
}) {
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
					value={value}
					onChange={(newValue) => {
						// extract unit from old value and assign it to newValue
						newValue = newValue + value.replace(/[0-9|-]/gi, '');

						onValueChange(newValue);
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
					onChange={onValueChange}
					className={controlClassNames(
						'text',
						'publisher-control-unit',
						className
					)}
				/>
			)}

			{!units && (
				<WPTextControl
					{...props}
					value={value}
					onChange={onValueChange}
					className={controlClassNames('text', className)}
				/>
			)}
		</div>
	);
}
