// @flow

/**
 * Blockera dependencies
 */
import { isFunction } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { ControlEffectType } from '../types';

export default function useControlEffect({
	onChange,
	actionRefId,
	valueCleanup,
}: Object): ControlEffectType {
	const refId =
		actionRefId && actionRefId?.current?.reset ? actionRefId : undefined;

	return (value: any, _ref?: Object): any => {
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
}
