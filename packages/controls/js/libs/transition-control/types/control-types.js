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
	/**
	 * When true, does not pass variable / value-addon support to the repeater
	 * (`controlAddonTypes`, `variableTypes`).
	 */
	withoutValueAddons?: boolean,
	defaultRepeaterItemValue?: TransitionControlItemValue,
};
