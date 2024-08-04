// @flow

import type { RepeaterControlProps } from '../../repeater-control/types';

export type TItem = {
	position: 'top' | 'bottom',
	shape: { type: 'shape' | 'custom', id: string },
	color: string,
	size: { width: string, height: string },
	animate: boolean,
	duration: string,
	flip: boolean,
	onFront: boolean,
	isVisible: boolean,
};

export type TDividerControlProps = {
	...RepeaterControlProps,
	defaultRepeaterItemValue?: TItem,
	defaultValue?: Array<TItem>,
	value: Array<TItem>,
};
