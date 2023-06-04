/**
 * WordPress dependencies
 */
import { __experimentalUnitControl as WPUnitControl } from '@wordpress/block-editor';
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

export default function UnitControl({
	units,
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
		null,
		attributes
	);

	return (
		<WPUnitControl
			{...props}
			units={units}
			value={controlValue}
			className={controlClassNames('unit', className)}
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
			isUnitSelectTabbable={false}
		/>
	);
}
