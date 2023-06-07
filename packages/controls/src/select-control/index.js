/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { SelectControl as WPSelectControl } from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { renderSelectNativeOption } from './utils';

const SelectControl = ({
	initValue = '',
	options,
	children,
	//
	value: _value,
	//
	className,
	onValueChange = () => {},
}) => {
	const [value, setValue] = useState(_value || initValue);

	return (
		<WPSelectControl
			className={controlClassNames('select', 'native-select', className)}
			value={value}
			onChange={(newValue) => {
				setValue(newValue);

				onValueChange(newValue);
			}}
			__nextHasNoMarginBottom
		>
			{options?.map(renderSelectNativeOption)}
			{children}
		</WPSelectControl>
	);
};

export default SelectControl;
