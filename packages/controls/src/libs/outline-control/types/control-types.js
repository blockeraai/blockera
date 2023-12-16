// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types/repeater-control-props';
import type { BorderControlBorderStyle } from '../../border-control/types';

export type TItem = {
	border: {
		width: string,
		style: BorderControlBorderStyle,
		color: string,
	},
	offset: string,
	isVisible: boolean,
};

export type TOutlineControlProps = {
	...RepeaterControlProps,
	defaultRepeaterItemValue?: TItem,
};
