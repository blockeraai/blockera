/**
 * External dependencies
 */
import { GradientPicker as WPGradientPicker } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { useValue } from '@publisher/utils';

export default function GradientBarControl({
	defaultValue,
	value: initialValue,
	className,
	onChange,
}) {
	const { value, setValue } = useValue({
		initialValue,
		defaultValue,
		onChange,
	});

	return (
		<div className={controlClassNames('gradient-bar', className)}>
			<WPGradientPicker
				value={value}
				gradients={[]}
				clearable={false}
				onChange={(newValue) => {
					setValue(newValue);
				}}
			/>
		</div>
	);
}

GradientBarControl.propTypes = {
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
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
};

GradientBarControl.defaultProps = {
	defaultValue: null,
	onChange: () => {},
};
