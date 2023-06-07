/**
 * WordPress dependencies
 */
import { __experimentalUnitControl as WPUnitControl } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function UnitControl({
	units,
	//
	initValue,
	value,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = () => {},
	...props
}) {
	const [controlValue, setControlValue] = useState(value || initValue);

	return (
		<WPUnitControl
			{...props}
			units={units}
			value={controlValue}
			className={controlClassNames('unit', className)}
			onChange={(newValue) => {
				newValue = onChange(newValue);
				setControlValue(newValue);
				onValueChange(newValue);
				return newValue;
			}}
			isUnitSelectTabbable={false}
		/>
	);
}
