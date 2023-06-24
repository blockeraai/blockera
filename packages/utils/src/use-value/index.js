import { useState, useEffect } from '@wordpress/element';

export function useValue({ initialValue, defaultValue, onValueChange = null }) {
	const [value, setValue] = useState(
		typeof initialValue === 'undefined' || initialValue === null
			? defaultValue
			: initialValue
	);

	useEffect(() => {
		if (typeof onValueChange === 'function') onValueChange(value);
	}, [value]);

	// can be used to toggle value if it was boolean
	function toggleValue() {
		if (typeof value === 'boolean') {
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
