// @flow
/**
 * Publisher dependencies
 */
import type { PopoverPlacement } from '@publisher/components';

/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type ColorPickerControlProps = {
	...ControlGeneralTypes,
	popoverTitle?: string,
	isOpen?: boolean,
	onClose?: () => void,
	placement?: PopoverPlacement,
	isPopover?: boolean,
	hasClearBtn?: boolean,
};
