// @flow

/**
 * Internal dependencies
 */
import type { ValueAddon } from './types';

export function isValid(value: ValueAddon | string): boolean {
	//$FlowFixMe
	return !!value?.isValueAddon;
}
