// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types/repeater-control-props';

export type FilterTypes =
	| 'blur'
	| 'drop-shadow'
	| 'brightness'
	| 'contrast'
	| 'hue-rotate'
	| 'saturate'
	| 'grayscale'
	| 'invert'
	| 'sepia';

export type TItem = {
	type: FilterTypes,
	blur: string,
	brightness: string,
	contrast: string,
	'hue-rotate': string,
	saturate: string,
	grayscale: string,
	invert: string,
	sepia: string,
	'drop-shadow-x': string,
	'drop-shadow-y': string,
	'drop-shadow-blur': string,
	'drop-shadow-color': string,
	isVisible: boolean,
};

export type FilterControlProps = {
	...RepeaterControlProps,
	defaultRepeaterItemValue?: TItem,
};

export type TValueCleanUp = Array<Object> | any;
