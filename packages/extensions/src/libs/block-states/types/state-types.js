// @flow

import type { BreakpointTypes, TBreakpoint } from './breakpoint-types';

export type TStates =
	| 'normal'
	| 'hover'
	| 'active'
	| 'focus'
	| 'visited'
	| 'before'
	| 'after'
	| 'custom-class'
	| 'parent-class'
	| 'parent-hover';

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
		max: number,
		min: number,
		color: string,
		cssSelector?: string,
	},
	breakpoints: { [key: TBreakpoint]: BreakpointTypes },
};

export type BlockStates = {
	[key: TStates]: { ...StateTypes, isSelected: boolean },
};
