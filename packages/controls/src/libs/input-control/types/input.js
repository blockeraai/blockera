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
	| 'z-index'
	| 'grid-size'
	| 'grid-min-size';

export type InputControlProps = {
	...ControlGeneralTypes,
	...ControlValueAddonTypes,
	// eslint-disable-next-line
	unitType?: InputUnitTypes,
	units?: Array<Object>,
	noBorder?: boolean,
	range?: boolean,
	field?: string,
	singularId?: string,
	repeaterItem?: number,
	type?: 'text' | 'number',
	min?: number,
	max?: number,
	validator?: (value: string | number) => boolean,
	disabled?: boolean,
	drag?: boolean,
	float?: boolean,
	arrows?: boolean,
	actions?: Node,
	placeholder?: string,
	size?: ControlSize,
};

export type InnerInputControlProps = {
	...InputControlProps,
	value: any,
	setValue: (any) => void,
};
