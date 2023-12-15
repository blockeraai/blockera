// @flow
/**
 * External dependencies
 */
import type { Node } from 'react';

/**
 * Internal dependencies
 */
import type { ControlSize } from '../../../types';

export type TNumberInput = {
	value: number | string,
	setValue: (value: string | number) => void,
	noBorder?: boolean,
	className?: string,
	disabled?: boolean,
	validator?: ?(value: string | number) => boolean,
	min?: number,
	max?: number,
	range?: boolean,
	arrows?: boolean,
	drag?: boolean,
	float?: boolean,
	size: ControlSize,
	actions?: Node,
	children?: Node,
};
