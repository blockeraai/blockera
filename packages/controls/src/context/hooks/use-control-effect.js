// @flow
/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isFunction } from '@publisher/utils';

export default function useControlEffect(
	{ ref, onChange, sideEffect, valueCleanup, value: controlValue }: Object,
	dependencies: Array<any> = []
): (data: any) => any {
	const refId = ref && ref?.current?.reset ? ref.current : undefined;

	const setValue = (value: any, _ref?: Object = undefined): any => {
		if (refId) {
			_ref = refId;
		}

		if (isFunction(onChange)) {
			// eslint-disable-next-line no-unused-expressions
			isFunction(valueCleanup)
				? onChange(valueCleanup(value), _ref)
				: onChange(value, _ref);
		}
	};

	if (!sideEffect) {
		return setValue;
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(
		() => {
			setValue(controlValue);

			if (ref) {
				ref.current = {
					reset: false,
					keys: [],
					path: '',
				};
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		dependencies
	);

	return setValue;
}
