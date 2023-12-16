// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types/repeater-control-props';

export type TItem = {
	name: string,
	value: string,
	isVisible: boolean,
};

export type CustomPropertyControlProps = {
	...RepeaterControlProps,
	defaultRepeaterItemValue?: TItem,
};
