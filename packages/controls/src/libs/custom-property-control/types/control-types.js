// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';

export type TItem = {
	name: string,
	value: string,
	isVisible: boolean,
};

export type CustomPropertyControlProps = {
	...RepeaterControlProps,
	defaultRepeaterItemValue?: TItem,
};
