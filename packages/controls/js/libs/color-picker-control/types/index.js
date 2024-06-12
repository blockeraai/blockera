// @flow
/**
 * Blockera dependencies
 */

/**
 * Internal dependencies
 */
import type { PopoverPlacement } from '../../';
import type { ControlGeneralTypes } from '../../../types';

export type ColorPickerControlProps = {
	...ControlGeneralTypes,
	/**
	 * Popover title
	 */
	popoverTitle?: string,
	/**
	 * Popover placement
	 */
	placement?: PopoverPlacement,
	/**
	 * is ColorPicker popover open  by default or not?
	 */
	isOpen?: boolean,
	/**
	 * event that will be fired while closing popover
	 */
	onClose?: () => void,
	/**
	 * Render as a Popover component or only show children
	 */
	isPopover?: boolean,
	/**
	 * Show clear button
	 */
	hasClearBtn?: boolean,
};
