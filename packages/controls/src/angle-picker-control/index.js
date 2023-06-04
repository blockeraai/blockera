/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { AnglePickerControl as WordPressAnglePickerControl } from '@wordpress/components';
import { controlClassNames } from '@publisher/classnames';

/**
 * Publisher dependencies
 */
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import './style.scss';
import { getControlValue, updateControlValue } from './../utils';

export default function AnglePickerControl({
	initValue = 0,
	//
	value,
	attribute,
	repeaterAttributeIndex = null,
	repeaterAttribute = null,
	//
	className,
	onChange = () => {},
	...props
}) {
	const { attributes, setAttributes } = useContext(BlockEditContext);

	let controlValue = getControlValue(
		value,
		attribute,
		repeaterAttribute,
		repeaterAttributeIndex,
		initValue,
		attributes
	);

	return (
		<WordPressAnglePickerControl
			{...props}
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
			label=""
			__nextHasNoMarginBottom
			className={controlClassNames('angle', className)}
		/>
	);
}
