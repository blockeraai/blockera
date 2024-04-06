// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type BoxBorderControlProps = {
	...ControlGeneralTypes,
	defaultValue?: TValueTypes,
};

export type TValueTypes = {
	type: 'all' | 'custom',
	all?: {
		width: string,
		style: string,
		color: string,
	},
	left?: {
		width: string,
		style: string,
		color: string,
	},
	right?: {
		width: string,
		style: string,
		color: string,
	},
	top?: {
		width: string,
		style: string,
		color: string,
	},
	bottom?: {
		width: string,
		style: string,
		color: string,
	},
};
