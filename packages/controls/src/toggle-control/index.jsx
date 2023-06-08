/**
 * WordPress dependencies
 */
import { ToggleControl as WPToggleControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

export default function ToggleControl({
	value,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = () => {},

	...props
}) {
	return (
		<WPToggleControl
			value={value}
			onChange={(newValue) => {
				newValue = onChange(newValue);
				onValueChange(newValue);
			}}
			className={controlClassNames('toggle-control', className)}
			{...props}
		/>
	);
}
