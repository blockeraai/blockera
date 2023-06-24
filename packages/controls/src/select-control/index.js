/**
 * External dependencies
 */
import {
	SelectControl as WPSelectControl,
	CustomSelectControl as WPCustomSelectControl,
} from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { useValue } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { renderSelectNativeOption, prepareSelectCustomOptions } from './utils';

const SelectControl = ({
	type,
	options,
	customMenuPosition,
	noBorder,
	multiple,
	//
	defaultValue,
	value: initialValue,
	onChange,
	//
	className,
}) => {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
	});

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
					onChange={setValue}
					multiple={multiple}
					__nextHasNoMarginBottom
				>
					{options?.map(renderSelectNativeOption)}
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
						setValue(selectedItem.key);
					}}
					options={options}
				/>
			)}
		</>
	);
};

export default SelectControl;

SelectControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onValueChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * The current value.
	 */
	value: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Type of select. `native` is the browser native select control and the `custom` is custom developed select that is more advanced and it's options support icon.
	 */
	type: PropTypes.oneOf(['native', 'custom']),
	/**
	 * Select control options array.
	 */
	options: PropTypes.array,
	/**
	 * Select dropdown menu position for `custom` select control.
	 */
	customMenuPosition: PropTypes.oneOf(['bottom', 'top']),
	/**
	 * By using this you can prevent the control to show the border and outline shape.
	 */
	noBorder: PropTypes.bool,
	/**
	 * WP Button Props 👇
	 */
	/**
	 * 🔗 WP SelectControl → If this property is added, multiple values can be selected. The `value` passed should be an array.
	 *
	 * It only works in `native` type.
	 *
	 * In most cases, it is preferable to use the `FormTokenField` or `CheckboxControl` components instead.
	 *
	 * @default false
	 */
	multiple: PropTypes.bool,
};

SelectControl.defaultProps = {
	defaultValue: '',
	type: 'native',
	customMenuPosition: 'bottom',
	noBorder: false,
	multiple: false,
};
