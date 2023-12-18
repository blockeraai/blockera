// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type Props = {
	...ControlGeneralTypes,
	inputFields?: boolean,
	size?: number,
	//
	defaultValue?: {
		top: string,
		left: string,
	},
};

export type Location = 'top' | 'bottom' | 'right' | 'left' | 'center';

export type Coordinates = {
	calculated: boolean,
	compact: string,
	top: {
		number: string,
		text: string,
	},
	left: {
		number: string,
		text: string,
	},
};
