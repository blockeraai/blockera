// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Internal dependencies
 */
import type {
	TDefaultRepeaterItemValue,
	TMeshGradientColors,
} from './control-types';

export type HeaderItem = {
	item: TDefaultRepeaterItemValue,
	itemId: number,
	isOpen: boolean,
	setOpen: (isOpen: boolean) => void,
	children: Element<any>,
	isOpenPopoverEvent: (event: Object) => void,
};

export type MeshGradientHeaderItem = {
	item: TMeshGradientColors,
	itemId: number,
	isOpen: boolean,
	setOpen: (isOpen: boolean) => void,
	children: Element<any>,
	isOpenPopoverEvent: (event: Object) => void,
};
