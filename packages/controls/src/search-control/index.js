/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { SearchControl as WPSearchControl } from '@wordpress/components';
import PropTypes from 'prop-types';

/**
 * Publisher dependencies
 */
import { controlClassNames } from '@publisher/classnames';
import { useValue } from '@publisher/utils';

export default function SearchControl({
	value: initialValue,
	defaultValue,
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
		<WPSearchControl
			value={value}
			onChange={setValue}
			className={controlClassNames('search', className)}
			{...props}
		/>
	);
}

SearchControl.propTypes = {
	/**
	 * A placeholder for the input.
	 */
	placeholder: PropTypes.string,
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

SearchControl.defaultProps = {
	placeholder: __('Search…', 'publisher-core'),
	value: '',
	defaultValue: '',
};
