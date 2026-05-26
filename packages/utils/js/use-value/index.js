/**
 * External Dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import {
	isArray,
	isBoolean,
	isFunction,
	isNull,
	isObject,
	isUndefined,
} from '../is';
import { useLateEffect } from '../use-late-effect';

export function useValue({
	initialValue,
	defaultValue,
	innerDefaultValue,
	onChange,
	valueCleanup,
	mergeInitialAndDefault,
}) {
	const calculatedInitValue = getCalculatedInitValue();
	const [value, setValue] = useState(calculatedInitValue);

	// don't fire change for value at first time!
	useLateEffect(() => {
		if (isFunction(onChange)) {
			if (isFunction(valueCleanup)) onChange(valueCleanup(value));
			else onChange(value);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	//clean up data at first then fire state change
	function updateValue(newValue) {
		setValue(newValue);
	}

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

	function getCalculatedInitValue() {
		if (isUndefined(initialValue) || isNull(initialValue)) {
			return defaultValue;
		}
		if (mergeInitialAndDefault) {
			if (isObject(initialValue) && isObject(defaultValue))
				return { ...defaultValue, ...initialValue };

			// merge default value to object elements inside initialValue
			// used for repeaters
			if (isArray(initialValue) && isObject(innerDefaultValue)) {
				initialValue.forEach((item, itemId) => {
					if (isObject(item)) {
						initialValue[itemId] = {
							...innerDefaultValue,
							...item,
						};
					}
				});
			}
		}

		return initialValue;
	}

	return {
		value,
		setValue: updateValue,
		toggleValue,
		resetToDefault,
		resetToInitial,
	};
}
