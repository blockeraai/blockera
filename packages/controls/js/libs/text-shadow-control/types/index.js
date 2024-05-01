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
	defaultRepeaterItemValue?: DefaultRepeaterItemValue,
};
