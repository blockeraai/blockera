/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { GradientPicker as WPGradientPicker } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { getControlValue, updateControlValue } from './../utils';
import './style.scss';

const GradientBarControl = ({
	initValue = null,
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
		initValue,
		attributes
	);

	return (
		<WPGradientPicker
			className={controlClassNames('select', 'native-select', className)}
			value={controlValue}
			gradients={[]}
			clearable={false}
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
		/>
	);
};

export default GradientBarControl;
