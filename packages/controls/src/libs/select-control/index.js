// @flow

/**
 * External dependencies
 */
import {
	SelectControl as WPSelectControl,
	CustomSelectControl as WPCustomSelectControl,
} from '@wordpress/components';
import PropTypes from 'prop-types';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import type { TSelectControlProps } from './types';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import { renderSelectNativeOption, prepareSelectCustomOptions } from './utils';

const SelectControl = ({
	type = 'native',
	options,
	customMenuPosition = 'bottom',
	customHideInputIcon = false,
	customHideInputLabel = false,
	customHideInputCaret = false,
	customInputCenterContent = false,
	noBorder = false,
	multiple = false,
	//
	id,
	label = '',
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns,
	defaultValue = '',
	onChange,
	field = 'select',
	//
	className,
}: TSelectControlProps): MixedElement => {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	if (type === 'custom') options = prepareSelectCustomOptions(options);

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	return (
		<BaseControl
			columns={columns}
			controlName={field}
			className={className}
			{...labelProps}
		>
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
						'menu-position-' + (customMenuPosition || null),
						noBorder && 'no-border',
						customHideInputIcon && 'input-hide-icon',
						customHideInputLabel && 'input-hide-label',
						customHideInputCaret && 'input-hide-caret',
						customInputCenterContent && 'input-align-center',
						className
					)}
					value={options.find((option) => option.key === value)}
					onChange={({ selectedItem }) => {
						setValue(selectedItem.key);
					}}
					options={options}
				/>
			)}
		</BaseControl>
	);
};

export default SelectControl;

SelectControl.propTypes = {
	/**
	 * ID for retrieving value from control context
	 */
	id: PropTypes.string,
	/**
	 * Label for field. If you pass empty value the field will not be added and simple control will be rendered
	 *
	 * @default ""
	 */
	label: PropTypes.string,
	/**
	 * Field id for passing into child Field component
	 *
	 * @default "toggle-select"
	 */
	field: PropTypes.string,
	/**
	 * Columns setting for Field grid.
	 *
	 * @default "columns-2"
	 */
	columns: PropTypes.string,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.string,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * Type of select. `native` is the browser native select control and the `custom` is custom developed select that is more advanced and it's options support icon.
	 */
	// $FlowFixMe
	type: PropTypes.oneOf(['native', 'custom']),
	/**
	 * Select control options array.
	 */
	options: PropTypes.array,
	/**
	 * Select dropdown menu position for `custom` select control.
	 */
	// $FlowFixMe
	customMenuPosition: PropTypes.oneOf(['bottom', 'top']),
	/**
	 * Hides icon for current select item but icons of dropdown items will be shown
	 */
	customHideInputIcon: PropTypes.bool,
	/**
	 * Hides label for current select item but label's of dropdown items will be shown
	 */
	customHideInputLabel: PropTypes.bool,
	/**
	 * Hides input caret icon
	 */
	customHideInputCaret: PropTypes.bool,
	/**
	 * Sets the content of input content to center align but does not affect drop-down menu items
	 */
	customInputCenterContent: PropTypes.bool,
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
