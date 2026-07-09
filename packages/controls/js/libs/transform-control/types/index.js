// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';

export type TransformControlRepeaterItemValue = {
	type: 'move' | 'scale' | 'rotate' | 'skew',
	'move-x': string,
	'move-y': string,
	'move-z': string,
	scale: string,
	'rotate-x': string,
	'rotate-y': string,
	'rotate-z': string,
	'skew-x': string,
	'skew-y': string,
	isVisible: boolean,
};

export type TransformControlProps = {
	...RepeaterControlProps,
	onChange?: () => void,
	defaultRepeaterItemValue?: TransformControlRepeaterItemValue,
};
