// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { BreakpointTypes, TBreakpoint } from './breakpoint-types';

export type TStates =
	| 'normal'
	| 'hover'
	| 'active'
	| 'focus'
	| 'visited'
	| 'before'
	| 'after'
	| 'empty'
	| 'custom-class'
	| 'parent-class'
	| 'parent-hover'
	| string;

export type TStatesLabel =
	| 'Normal'
	| 'Hover'
	| 'Active'
	| 'Focus'
	| 'Visited'
	| 'Before'
	| 'After'
	| 'Custom Class'
	| 'Parent Class'
	| 'Parent Hover';

export type StateTypes = {
	type: TStates,
	force: boolean,
	label: TStatesLabel,
	settings: {
		max?: number,
		min?: number,
		color: string,
		cssSelector?: string,
	},
	priority: number,
	native?: boolean,
	breakpoints: { [key: TBreakpoint]: BreakpointTypes },
	categoryLabel?: string,
	category?: string,
	tooltip?: string | MixedElement,
};

export type BlockStates = {
	[key: TStates | string]: { ...StateTypes, isSelected: boolean },
};

export type BlockStateType = {
	type: string,
	label: TStatesLabel,
	breakpoints: Object,
	disabled?: boolean,
};
