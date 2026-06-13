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
	/** Runs on every header click (e.g. clear canvas hover preview). */
	readonly beforeClick?: () => void;
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
	beforeClick,
}: GetPresetRepeaterHeaderOnClickArgs): (event: MouseEvent) => void {
	return (event: MouseEvent) => {
		beforeClick?.();
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
