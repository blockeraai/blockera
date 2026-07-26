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
	 * Textarea custom height. Use `'auto'` to grow/shrink with content.
	 */
	height?: number | 'auto',
};
