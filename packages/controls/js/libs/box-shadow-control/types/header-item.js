// @flow
import type { TItem } from './control-types';

export type THeaderItem = {
	item: TItem,
	itemId: number,
	isOpen: boolean,
	setOpen: (isOpen: boolean) => void,
	children?: any,
	isOpenPopoverEvent: (event: Object) => void,
};
