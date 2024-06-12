// @flow

export type TBreakpoint =
	| 'laptop'
	| 'extra-large'
	| 'large'
	| 'desktop'
	| 'tablet'
	| 'mobile-landscape'
	| 'mobile';
export type TBreakpointLabel = 'Desktop' | 'Tablet' | 'Mobile';

export type BreakpointTypes = {
	type: TBreakpoint,
	force: boolean,
	label: TBreakpointLabel,
	settings: {
		min: string,
		max: string,
	},
	attributes?: Object,
};
