// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import type { VariableItem } from '@blockera/data';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../components/control/types';

export type ValueAddonProps = {
	/**
	 * The flag for shows value is type of addon value?
	 */
	isValueAddon?: boolean,
	/**
	 * The css class names.
	 */
	valueAddonClassNames: string,
	/**
	 * The value pointer as react element.
	 */
	ValueAddonPointer: () => Element<any>,
	/**
	 * Has set control value?
	 */
	isSetValueAddon: () => boolean,
	/**
	 * The control addon user interface to show addon value like: css variables or any other core entity value of WordPress as react component.
	 */
	ValueAddonControl: () => Element<any>,
	/**
	 * The control addon user interface to show addon value like: css variables or any other core entity value of WordPress as react component.
	 */
	valueAddonControlProps: ValueAddonControlProps,
	/**
	 * Handle on click icon of variables on control.
	 *
	 * The callback function
	 */
	handleOnClickVar: (data: VariableItem) => void,
	/**
	 * Handle click on unlink button
	 *
	 * The callback function
	 */
	handleOnUnlinkVar: (
		// eslint-disable-next-line
		event: SyntheticMouseEvent<EventTarget>
	) => void,
};
