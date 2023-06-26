/**
 * WordPress dependencies
 */
import { CheckboxControl as WPCheckboxControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */

const CheckboxControl = ({
	defaultValue = false,
	//
	value,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = (newValue) => {
		return newValue;
	},
	...props
}) => {
	return (
		<WPCheckboxControl
			className={controlClassNames('checkbox', className)}
			checked={value || defaultValue}
			onChange={(newValue) => {
				newValue = onChange(newValue);
				// setIsChecked(newValue);
				onValueChange(newValue);
			}}
			{...props}
		/>
	);
};

export default CheckboxControl;
