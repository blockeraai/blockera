// @flow

import type { AttributeControlValue } from './control-types';

export type THeaderItem = {
	item: AttributeControlValue,
	itemId: number,
	isOpen: boolean,
	setOpen: (isOpen: boolean) => void,
	children?: any,
	isOpenPopoverEvent: (event: Object) => void,
};
