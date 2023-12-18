// @flow

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
	breakpoints: Array<Object>,
};
