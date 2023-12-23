// @flow
/**
 * Internal dependencies
 */
import type { RepeaterControlProps } from '../../repeater-control/types';

type TRepeatTypes =
	| 'no-repeat'
	| 'repeat'
	| 'repeat-x'
	| 'repeat-y'
	| 'round'
	| 'space';

export type TItem = {
	shape: { type: 'shape' | 'custom', id: string },
	size: 'fit' | 'cover' | 'contain',
	repeat: TRepeatTypes,
	position: { top: string, left: string },
	'horizontally-flip': boolean,
	'vertically-flip': boolean,
	isVisible: boolean,
};

export type TMaskControlProps = {
	...RepeaterControlProps,
	defaultRepeaterItemValue?: TItem,
};
