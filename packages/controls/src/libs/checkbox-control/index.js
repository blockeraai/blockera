/**
 * External dependencies
 */
import { CheckboxControl as WPCheckboxControl } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { useValue } from '@publisher/utils';

export default function CheckboxControl({
	defaultValue,
	value: initialValue,
	onChange,
	className,
	label,
	...props
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
	});

	return (
		<WPCheckboxControl
			className={controlClassNames('checkbox', className)}
			checked={value}
			onChange={setValue}
			label={label}
			{...props}
		/>
	);
}

CheckboxControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue: PropTypes.bool,
	/**
	 * The current value.
	 */
	value: PropTypes.bool,
	/**
	 * Function that will be fired while the control value state changes.
	 */
	onChange: PropTypes.func,
	/**
	 * A label for the input field, that appears at the side of the checkbox.
	 * The prop will be rendered as content a label element. If no prop is
	 * passed an empty label is rendered.
	 */
	label: PropTypes.string,
};

CheckboxControl.defaultProps = {
	defaultValue: false,
};
