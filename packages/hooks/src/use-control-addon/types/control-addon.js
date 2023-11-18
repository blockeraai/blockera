// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

export type ControlAddon = {
	/**
	 * The css class names.
	 */
	classNames: string,
	/**
	 * The control pointer react component.
	 */
	ControlAddonPointer: () => Element<any>,
	/**
	 * Has set control value?
	 */
	controlAddonHasValue: () => boolean,
	/**
	 * The control addon user interface to show addon value like: css variables or any other core entity value of WordPress as react component.
	 */
	ControlAddonUI: () => Element<any>,
	/**
	 * Handle on click icon of variables on control.
	 *
	 * The callback function
	 */
	handleOnClickVariables: (
		// eslint-disable-next-line
		event: SyntheticEvent<HTMLButtonElement>
	) => void,
	/**
	 * Handle on click icon of dynamic values on control.
	 *
	 * The callback function
	 */
	handleOnClickDynamicValues: (
		// eslint-disable-next-line
		event: SyntheticEvent<HTMLButtonElement>
	) => void,
};
