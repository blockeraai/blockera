// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TValue = {
	type: 'all' | 'custom',
	all?: string,
	topLeft?: string,
	topRight?: string,
	bottomLeft?: string,
	bottomRight?: string,
};

export type BorderRadiusControlProps = {
	...ControlGeneralTypes,
	defaultValue?: TValue,
};
