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
};

/**
 * Repeater preset header click: selectable rows delegate to GroupControl; otherwise toggle the popover when allowed.
 */
export function getPresetRepeaterHeaderOnClick({
	item,
	isOpen,
	setOpen,
	isOpenPopoverEvent,
}: GetPresetRepeaterHeaderOnClickArgs): (event: MouseEvent) => void {
	return (event: MouseEvent) => {
		if (item?.selectable) {
			return;
		}
		if (isOpenPopoverEvent(event)) {
			setOpen(!isOpen);
		}
	};
}
