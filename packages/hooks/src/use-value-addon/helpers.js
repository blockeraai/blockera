// @flow
/**
 * Internal dependencies
 */
import type { ValueAddon } from './types/value-addon';

export const isValid = ({ isValueAddon = false }: ValueAddon): boolean => {
	return isValueAddon;
};

export function getValueAddonRealValue(value: ValueAddon | string): string {
	if (typeof value === 'number') {
		return value;
	}

	if (typeof value === 'string') {
		return value.endsWith('func') ? value.slice(0, -4) : value;
	}

	//$FlowFixMe
	return value;
}
