// @flow
/**
 * Internal dependencies
 */
import type { ValueAddon } from './types/value-addon';

export const isValid = ({ isValueAddon = false }: ValueAddon): boolean => {
	return isValueAddon;
};
