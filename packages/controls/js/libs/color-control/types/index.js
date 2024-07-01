// @flow
/**
 * Internal dependencies
 */
import type {
	ControlGeneralTypes,
	ControlValueAddonTypes,
	ControlSize,
} from '../../../types';

export type ColorControlProps = {
	...ControlGeneralTypes,
	...ControlValueAddonTypes,
	/**
	 * Type of CSS units from presets
	 */
	type?: 'normal' | 'minimal',
	/**
	 * By using this you can prevent the control to show the border and outline shape.
	 */
	noBorder?: boolean,
	/**
	 * It is useful for buttons with specified width and allows you to align the content to `left` or `right`. By default, it's `center` and handled by flex justify-content property.
	 */
	contentAlign?: 'left' | 'center' | 'right',
	size?: ControlSize,
};
