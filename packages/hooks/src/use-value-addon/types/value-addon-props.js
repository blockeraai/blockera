// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

export type ValueAddonProps = {
	/**
	 * The css class names.
	 */
	classNames: string,
	/**
	 * The value pointer as react element.
	 */
	ValueAddonPointer: () => Element<any>,
	/**
	 * Has set control value?
	 */
	issetValueAddon: () => boolean,
	/**
	 * The control addon user interface to show addon value like: css variables or any other core entity value of WordPress as react component.
	 */
	ValueAddonUI: () => Element<any>,
	/**
	 * Handle on click icon of variables on control.
	 *
	 * The callback function
	 */
	handleOnClickVariable: (
		// eslint-disable-next-line
		event: SyntheticMouseEvent<EventTarget>
	) => void,
	/**
	 * Handle on click icon of dynamic values on control.
	 *
	 * TODO: please uncomment after final implements DynamicValuePicker component.
	 * The callback function
	 */
	// handleOnClickDynamicValue: (
	// 	// eslint-disable-next-line
	// 	event: SyntheticMouseEvent<EventTarget>
	// ) => void,
};
