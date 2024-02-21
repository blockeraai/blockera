// @flow
/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { isFunction } from '@publisher/utils';

/**
 * Internal dependencies
 */
import type { ControlEffectType } from '../types';

export default function useControlEffect(
	{
		ref,
		onChange,
		resetRef,
		sideEffect,
		controlInfo,
		valueCleanup,
		value: controlValue,
	}: Object,
	dependencies: Array<any> = []
): ControlEffectType {
	const refId = ref && ref?.current?.reset ? ref : undefined;

	const setValue = (value: any, _ref?: Object): any => {
		if (refId) {
			_ref = refId;
		}

		if (isFunction(onChange)) {
			// eslint-disable-next-line no-unused-expressions
			isFunction(valueCleanup) && !controlInfo.hasSideEffect
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

			resetRef();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		dependencies
	);

	return setValue;
}
