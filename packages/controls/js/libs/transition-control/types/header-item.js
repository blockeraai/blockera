// @flow
import type { TransitionControlItemValue } from './control-types';

export type THeaderItem = {
	item: TransitionControlItemValue,
	itemId?: number,
	isOpen?: boolean,
	setOpen: (isOpen: boolean) => void,
	children?: any,
	isOpenPopoverEvent: (event: Object) => void,
};
