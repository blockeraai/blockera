// @flow
/**
 * External dependencies
 */
import { CheckboxControl as WPCheckboxControl } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import type { MixedElement } from 'react';

type Props = {
	checkboxLabel: string,
	id?: string,
	label?: string,
	columns?: string,
	defaultValue?: boolean,
	onChange?: () => void,
	field?: string,
	className?: string,
};

export default function CheckboxControl({
	checkboxLabel,
	//
	id,
	label,
	columns,
	defaultValue = false,
	onChange,
	field = 'checkbox',
	//
	className,
	...props
}: Props): MixedElement {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	return (
		<BaseControl
			label={label}
			columns={columns}
			controlName={field}
			className={className}
		>
			<WPCheckboxControl
				className={controlClassNames('checkbox', className)}
				checked={value}
				onChange={setValue}
				label={checkboxLabel}
				{...props}
			/>
		</BaseControl>
	);
}

CheckboxControl.propTypes = {
	/**
	 * Label for checkbox.
	 *
	 * @default ""
	 */
	checkboxLabel: PropTypes.string.isRequired,
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
	defaultValue: PropTypes.bool,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
};

CheckboxControl.defaultProps = {
	defaultValue: false,
	field: 'checkbox',
};
