// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TTextAreaItem = {
	...ControlGeneralTypes,
	/**
	 * By using this you can disable the control.
	 */
	disabled?: boolean,
	/**
	 * Textarea custom height
	 */
	height?: number,
};
