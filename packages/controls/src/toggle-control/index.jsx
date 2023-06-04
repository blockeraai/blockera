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
	onChange = () => { },
	...props
}) {

	const { attributes, setAttributes } = useContext(BlockEditContext);

	let controlValue = getControlValue(
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
				updateControlValue(
					newValue,
					attribute,
					repeaterAttribute,
					repeaterAttributeIndex,
					attributes,
					setAttributes
				);

				onChange(newValue);
			}}
			className={controlClassNames('toggle-control', className)}
			{...props}
		/>
	);
}
