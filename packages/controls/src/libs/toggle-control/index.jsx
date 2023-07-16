/**
 * External dependencies
 */
import { ToggleControl as WPToggleControl } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { useValue } from '@publisher/utils';

export default function ToggleControl({
	label,
	defaultValue,
	value: initialValue,
	onChange,
	className,
	...props
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
	});

	return (
		<WPToggleControl
			label={label}
			checked={value}
			onChange={setValue}
			className={controlClassNames('toggle', className)}
			{...props}
		/>
	);
}

ToggleControl.propTypes = {
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
	 * Label after toggle
	 */
	label: PropTypes.string,
};

ToggleControl.defaultProps = {
	value: false,
	label: '',
};
