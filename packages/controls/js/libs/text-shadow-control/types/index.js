// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';

type DefaultRepeaterItemValue = {
	x: string,
	y: string,
	blur: string,
	color: string,
	isVisible: boolean,
};
export type TTextShadowControlProps = {
	...RepeaterControlProps,
	/**
	 * When true, does not pass variable / value-addon support to the repeater
	 * (`controlAddonTypes`, `variableTypes`).
	 */
	withoutValueAddons?: boolean,
	defaultRepeaterItemValue?: DefaultRepeaterItemValue,
};
