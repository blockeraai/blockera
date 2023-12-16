// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types/repeater-control-props';

export type TItem = {
	key: string,
	__key: string,
	value: string,
	isVisible: boolean,
};

export type AttributesControlElement = 'a' | 'button' | 'ol';

export type AttributesControlProps = {
	...RepeaterControlProps,
	defaultValue?: [],
	defaultRepeaterItemValue?: TItem,
	popoverTitle?: string,
	className?: string,
	attributeElement: AttributesControlElement,
};
