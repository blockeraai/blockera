/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import {
	SelectControl as WPSelectControl,
	CustomSelectControl as WPCustomSelectControl,
} from '@wordpress/components';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { renderSelectNativeOption, prepareSelectCustomOptions } from './utils';

const SelectControl = ({
	initValue = '',
	options,
	children,
	type = 'native', // custom
	customMenuPosition = 'bottom', // top
	noBorder = false,
	//
	value: _value,
	//
	className,
	onChange = (newValue) => {
		return newValue;
	},
	onValueChange = (newValue) => {
		return newValue;
	},
}) => {
	const [value, setValue] = useState(_value || initValue);

	if (type === 'custom') options = prepareSelectCustomOptions(options);

	return (
		<>
			{type === 'native' && (
				<WPSelectControl
					className={controlClassNames(
						'select',
						'native',
						noBorder && 'no-border',
						className
					)}
					value={value}
					onChange={(newValue) => {
						newValue = onChange(newValue);
						setValue(newValue);
						onValueChange(newValue);
					}}
					__nextHasNoMarginBottom
				>
					{options?.map(renderSelectNativeOption)}
					{children}
				</WPSelectControl>
			)}

			{type === 'custom' && (
				<WPCustomSelectControl
					hideLabelFromVision={true}
					className={controlClassNames(
						'select',
						'custom',
						'menu-position-' + customMenuPosition,
						noBorder && 'no-border',
						className
					)}
					value={options.find((option) => option.key === value)}
					onChange={({ selectedItem }) => {
						let newValue = onChange(selectedItem.key);

						if (newValue === '') {
							newValue = initValue;
						}

						setValue(newValue);
						onValueChange(newValue);
					}}
					options={options}
				/>
			)}
		</>
	);
};

export default SelectControl;
