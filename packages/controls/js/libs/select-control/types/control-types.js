// @flow
import type { Element } from 'React';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type TNativeOption = {
	label: string,
	value: string,
	icon?: Element<any>,
	type?: string,
	disabled?: boolean,
	className?: string,
	style?: Object,
	options?: Array<Object>,
	key?: string,
};
export type TSelectOptions = TNativeOption[];

export type TSelectControlProps = {
	...ControlGeneralTypes,
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: string,
	/**
	 * Type of select. `native` is the browser native select control and the `custom` is custom developed select that is more advanced and it's options support icon.
	 */
	type?: 'native' | 'custom',
	/**
	 * Select control options array.
	 */
	options: TSelectOptions,
	/**
	 * Select dropdown menu position for `custom` select control.
	 */
	customMenuPosition?: 'bottom' | 'top',
	/**
	 * Hides icon for current select item but icons of dropdown items will be shown
	 */
	customHideInputIcon?: boolean,
	/**
	 * Hides label for current select item but label's of dropdown items will be shown
	 */
	customHideInputLabel?: boolean,
	/**
	 * Sets the content of input content to center align but does not affect drop-down menu items
	 */
	customInputCenterContent?: boolean,
	/**
	 * Hides input caret icon
	 */
	customHideInputCaret?: boolean,
	/**
	 * By using this you can prevent the control to show the border and outline shape.
	 */
	noBorder?: boolean,
	/**
	 * 🔗 WP SelectControl → If this property is added, multiple values can be selected. The `value` passed should be an array.
	 *
	 * It only works in `native` type.
	 *
	 * In most cases, it is preferable to use the `FormTokenField` or `CheckboxControl` components instead.
	 *
	 * @default false
	 */
	multiple?: boolean,
};
