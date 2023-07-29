/**
 * External dependencies
 */
import { CheckboxControl as WPCheckboxControl } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { Field } from '@publisher/fields';

/**
 * Internal dependencies
 */
import { useControlContext } from '../../context';

export default function CheckboxControl({
	checkboxLabel,
	//
	id,
	label,
	columns,
	defaultValue,
	onChange,
	field,
	//
	className,
	...props
}) {
	const { value, setValue } = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	return (
		<Field
			label={label}
			field={field}
			columns={columns}
			className={className}
		>
			<WPCheckboxControl
				className={controlClassNames('checkbox', className)}
				checked={value}
				onChange={setValue}
				label={checkboxLabel}
				{...props}
			/>
		</Field>
	);
}

CheckboxControl.propTypes = {
	/**
	 * Label for checkbox.
	 *
	 * @default ""
	 */
	checkboxLabel: PropTypes.string,
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
};

CheckboxControl.defaultProps = {
	defaultValue: false,
	field: 'checkbox',
};
