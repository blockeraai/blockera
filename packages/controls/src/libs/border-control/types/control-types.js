// @flow
/**
 * Internal dependencies
 */
import type { ControlGeneralTypes } from '../../../types';

export type BorderControlBorderStyle = 'solid' | 'dashed' | 'dotted' | 'double';

export type TDefaultValue = {
	width: string,
	style: BorderControlBorderStyle,
	color: string,
};

export type BorderControlProps = {
	...ControlGeneralTypes,
	linesDirection?: 'horizontal' | 'vertical',
	defaultValue?: TDefaultValue,
	customMenuPosition?: 'top' | 'bottom',
	__isWidthFocused?: boolean,
	__isColorFocused?: boolean,
	__isStyleFocused?: boolean,
};
