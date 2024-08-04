// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';

export type AttributeControlValue = {
	key: string,
	__key: string,
	value: string,
	isVisible: boolean,
};

export type AttributesControlElement = 'a' | 'button' | 'ol';

export type AttributesControlProps = {
	...RepeaterControlProps,
	defaultValue?: [],
	defaultRepeaterItemValue?: AttributeControlValue,
	popoverTitle?: string,
	className?: string,
	attributeElement: AttributesControlElement,
};
