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

export type ColorPalletProps = {
	/**
	 * ColorPallet className
	 */
	className?: string,
	/**
	 * Enable alpha channel
	 */
	enableAlpha?: boolean,
	/**
	 * Color of the color picker
	 */
	color: string,
	/**
	 * event that will be fired on color change
	 */
	onChangeComplete: (color: string) => void,
};
