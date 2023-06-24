/**
 * External Dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { isBoolean, isFunction, isNull, isUndefined } from '../is';

export function useValue({ initialValue, defaultValue, onChange = null }) {
	const [value, setValue] = useState(
		isUndefined(initialValue) || isNull(initialValue)
			? defaultValue
			: initialValue
	);

	useEffect(() => {
		if (isFunction(onChange)) onChange(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	// can be used to toggle value if it was boolean
	function toggleValue() {
		if (isBoolean(value)) {
			setValue(!value);
			return !value;
		}

		return false;
	}

	// resets current value to defaultValue
	function resetValue() {
		setValue(defaultValue);
	}

	return { value, setValue, toggleValue, resetValue };
}
