// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type BorderRadiusValue = {
	type: 'all' | 'custom',
	all?: string,
	topLeft?: string,
	topRight?: string,
	bottomLeft?: string,
	bottomRight?: string,
};

export type BorderRadiusControlProps = {
	...ControlGeneralTypes,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: BorderRadiusValue,
};
