/**
 * External Dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { isBoolean, isFunction, isNull, isObject, isUndefined } from '../is';
import { useLateEffect } from '../use-late-effect';

export function useValue({
	initialValue,
	defaultValue,
	onChange,
	mergeInitialAndDefault,
}) {
	const calculatedInitValue =
		// eslint-disable-next-line no-nested-ternary
		isUndefined(initialValue) || isNull(initialValue)
			? defaultValue
			: mergeInitialAndDefault &&
			  isObject(initialValue) &&
			  isObject(defaultValue)
			? { ...defaultValue, ...initialValue }
			: initialValue;

	const [value, setValue] = useState(calculatedInitValue);

	// don't fire change for value at first time!
	useLateEffect(() => {
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
	function resetToDefault() {
		setValue(defaultValue);
	}

	// resets current value to defaultValue
	function resetToInitial() {
		// initialValue actually should be calculated value to prevent issue while if the initialValue was merged with defaultValue
		setValue(calculatedInitValue);
	}

	return { value, setValue, toggleValue, resetToDefault, resetToInitial };
}
