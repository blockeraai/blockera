/**
 * External dependencies
 */
import type { MouseEvent } from 'react';

export type PresetRepeaterHeaderClickItem = {
	readonly selectable?: boolean;
};

export type GetPresetRepeaterHeaderOnClickArgs = {
	readonly item: PresetRepeaterHeaderClickItem;
	readonly isOpen: boolean;
	readonly setOpen: (open: boolean) => boolean;
	readonly isOpenPopoverEvent: (event: MouseEvent) => boolean;
	/**
	 * When false, the header does not open the edit popover (user cannot edit global styles).
	 * Variable-picker rows with `selectable` still delegate selection to GroupControl first.
	 */
	readonly allowEditPopover?: boolean;
};

/**
 * Repeater preset header click: selectable rows delegate to GroupControl; otherwise toggle the popover when allowed.
 */
export function getPresetRepeaterHeaderOnClick({
	item,
	isOpen,
	setOpen,
	isOpenPopoverEvent,
	allowEditPopover = true,
}: GetPresetRepeaterHeaderOnClickArgs): (event: MouseEvent) => void {
	return (event: MouseEvent) => {
		if (item?.selectable) {
			return;
		}
		if (allowEditPopover === false) {
			return;
		}
		if (isOpenPopoverEvent(event)) {
			setOpen(!isOpen);
		}
	};
}
