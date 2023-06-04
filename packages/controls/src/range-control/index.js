/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { RangeControl as WordPressRangeControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { getControlValue, updateControlValue } from './../utils';

const RangeControl = ({
	min,
	max,
	initialPosition,
	withInputField = true,
	//
	value,
	attribute,
	repeaterAttributeIndex = null,
	repeaterAttribute = null,
	//
	className,
	onChange = () => {},
}) => {
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
		<>
			<WordPressRangeControl
				{...{
					initialPosition,
					min,
					max,
					value: controlValue,
					onChange: (newValue) => {
						updateControlValue(
							newValue,
							attribute,
							repeaterAttribute,
							repeaterAttributeIndex,
							attributes,
							setAttributes
						);

						onChange(newValue);
					},
					className: controlClassNames('range', className),
				}}
				withInputField={withInputField}
				__nextHasNoMarginBottom={false}
			/>
		</>
	);
};

export default RangeControl;
