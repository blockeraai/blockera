/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isFunction } from '@publisher/utils';

export default function useControlEffect(
	{ onChange, sideEffect, valueCleanup, value: controlValue },
	dependencies = []
) {
	const setValue = (value) => {
		if (isFunction(onChange)) {
			// eslint-disable-next-line no-unused-expressions
			isFunction(valueCleanup)
				? onChange(valueCleanup(value))
				: onChange(value);
		}
	};

	if (!sideEffect) {
		return setValue;
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(
		() => setValue(controlValue),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		dependencies
	);

	return setValue;
}
