// @flow

/**
 * External dependencies
 */
import type { Node } from 'react';

/**
 * Internal dependencies
 */
import type {
	ControlGeneralTypes,
	ControlValueAddonTypes,
	ControlSize,
} from '../../../types';

export type InputUnitTypes =
	| 'outline'
	| 'text-shadow'
	| 'box-shadow'
	| 'background-size'
	| 'letter-spacing'
	| 'text-indent'
	| 'background-position'
	| 'duration'
	| 'angle'
	| 'percent'
	| 'width'
	| 'height'
	| 'min-height'
	| 'max-width'
	| 'max-height'
	| 'text-length'
	| 'padding'
	| 'essential'
	| 'general'
	| 'margin'
	| 'order'
	| 'flex-basis'
	| 'flex-shrink'
	| 'flex-grow'
	| 'line-height'
	| 'min-width'
	| 'z-index';

export type InputControlProps = {
	...ControlGeneralTypes,
	...ControlValueAddonTypes,
	/**
	 * Type of CSS units from presets
	 */
	unitType?: InputUnitTypes,
	/**
	 * Indicates units for showing unit for value.
	 */
	units?: Array<Object>,
	/**
	 * By using this you can prevent the control to show the border and outline shape.
	 */
	noBorder?: boolean,
	/**
	 * Sets to show range control for input or not
	 */
	range?: boolean,
	field?: string,
	singularId?: string,
	repeaterItem?: number,
	type?: 'text' | 'number',
	/**
	 * The minimum `value` allowed.
	 */
	min?: number,
	/**
	 * The maximum `value` allowed.
	 */
	max?: number,
	/**
	 * check the `input`,  A function used to validate input values.
	 */
	validator?: (value: string | number) => boolean,
	/**
	 * By using this you can disable the control.
	 */
	disabled?: boolean,
	drag?: boolean,
	float?: boolean,
	/**
	 * Show up and down arrow buttons or not
	 */
	arrows?: boolean,
	actions?: Node,
	placeholder?: string,
	size?: ControlSize,
	isValidValue?: boolean,
};

export type InnerInputControlProps = {
	...InputControlProps,
	value: any,
	setValue: (any) => void,
};
