/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isFunction } from '@publisher/utils';

export default function useControlEffect({
	value,
	onChange,
	sideEffect,
	valueCleanup,
	dependencies = [],
}) {
	const setValue = () => {
		if (isFunction(onChange)) {
			// eslint-disable-next-line no-unused-expressions
			isFunction(valueCleanup)
				? onChange(valueCleanup(value))
				: onChange(value);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	};

	if (!sideEffect) {
		return setValue;
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(setValue, [...dependencies]);

	return setValue;
}
