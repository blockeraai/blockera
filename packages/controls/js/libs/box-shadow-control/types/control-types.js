// @flow
import type { RepeaterControlProps } from '../../repeater-control/types';

export type TItem = {
	type: 'outer' | 'inner',
	x: string,
	y: string,
	blur: string,
	spread: string,
	color: string,
	isVisible: boolean,
};

export type BoxShadowControlProps = {
	...RepeaterControlProps,
	/**
	 * When true, does not pass variable / value-addon support to the repeater
	 * (`controlAddonTypes`, `variableTypes`).
	 */
	withoutValueAddons?: boolean,
	defaultRepeaterItemValue?: TItem,
};
