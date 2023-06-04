/**
 * WordPress dependencies
 */
import { useContext } from '@wordpress/element';
import { SelectControl as WPSelectControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { BlockEditContext } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import { renderSelectNativeOption } from './utils';
import { getControlValue, updateControlValue } from './../utils';

const SelectControl = ({
	initValue = '',
	options,
	children,
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
		<>
			<WPSelectControl
				className={controlClassNames(
					'select',
					'native-select',
					className
				)}
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
				__nextHasNoMarginBottom
			>
				{options?.map(renderSelectNativeOption)}
				{children}
			</WPSelectControl>
		</>
	);
};

export default SelectControl;
