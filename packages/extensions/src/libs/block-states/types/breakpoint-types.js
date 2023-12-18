// @flow

export type TBreakpoint = 'desktop' | 'tablet' | 'mobile';
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
