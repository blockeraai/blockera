// @flow

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type Props = {
	...ControlGeneralTypes,
	/**
	 * Show advanced input fields for changing top and left position or not?
	 */
	inputFields?: boolean,
	/**
	 * If provided, sets the size (width and height) of the control.
	 *
	 * @default 68
	 */
	size?: number,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
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

export type TAlignmentMatrixBox = {
	value: string,
	onChange: (data: any) => void,
	width?: number,
	className?: string,
};
