// @flow
/**
 * External dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';

export type TransitionControlItemValue = {
	type: string,
	duration: string,
	timing: string,
	delay: string,
	isVisible: boolean,
};
export type TTransitionControlProps = {
	...RepeaterControlProps,
	defaultRepeaterItemValue?: TransitionControlItemValue,
};
