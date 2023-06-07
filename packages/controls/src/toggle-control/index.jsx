/**
 * WordPress dependencies
 */
import { ToggleControl as WPToggleControl } from '@wordpress/components';
import { useContext } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { getControlValue, updateControlValue } from './../utils';

export default function ToggleControl({
	value,
	attribute,
	repeaterAttributeIndex = null,
	repeaterAttribute = null,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = () => {},

	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	const controlValue = getControlValue(
		value,
		attribute,
		repeaterAttribute,
		repeaterAttributeIndex,
		'',
		attributes
	);

	return (
		<WPToggleControl
			value={controlValue}
			onChange={(newValue) => {
				newValue = onChange(newValue);
				onValueChange(newValue);
			}}
			className={controlClassNames('toggle-control', className)}
			{...props}
		/>
	);
}
