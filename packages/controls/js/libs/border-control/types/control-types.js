// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type BorderControlBorderStyle = 'solid' | 'dashed' | 'dotted' | 'double';

export type TDefaultValue = {
	width: string,
	style: BorderControlBorderStyle,
	color: string,
};

export type BorderControlProps = {
	...ControlGeneralTypes,
	/**
	 * Indicates border-line icons direction
	 */
	linesDirection?: 'horizontal' | 'vertical',
	/**
	 * It sets the control default value if the value not provided. By using it the control will not fire onChange event for this default value on control first render,
	 */
	defaultValue?: TDefaultValue,
	/**
	 * Position of custom select context menu
	 *
	 * @default "bottom"
	 */
	customMenuPosition?: 'top' | 'bottom',
	/**
	 * Internal prop: indicates if width input has focus
	 */
	__isWidthFocused?: boolean,
	/**
	 * Internal prop: indicates if color picker field has focus
	 */
	__isColorFocused?: boolean,
	/**
	 * Internal prop: indicates if style field has focus
	 */
	__isStyleFocused?: boolean,
};
