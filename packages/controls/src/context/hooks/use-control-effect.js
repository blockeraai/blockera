// @flow
/**
 * External dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { isFunction, isEquals } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { ControlEffectType } from '../types';

export default function useControlEffect(
	{
		onChange,
		resetRef,
		sideEffect,
		actionRefId,
		controlInfo,
		valueCleanup,
		value: controlValue,
	}: Object,
	dependencies: Array<any> = []
): ControlEffectType {
	const refId =
		actionRefId && actionRefId?.current?.reset ? actionRefId : undefined;

	const setValue = (value: any, _ref?: Object): any => {
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
			if (isEquals(controlValue, controlInfo.value)) {
				return;
			}

			setValue(controlValue);

			resetRef();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		dependencies
	);

	return setValue;
}
