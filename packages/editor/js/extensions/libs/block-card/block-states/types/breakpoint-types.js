// @flow

export type TBreakpoint =
	| '2xl-desktop'
	| 'xl-desktop'
	| 'l-desktop'
	| 'desktop'
	| 'tablet'
	| 'mobile-landscape'
	| 'mobile';

export type TBreakpointLabel = 'Desktop' | 'Tablet' | 'Mobile';

export type BreakpointTypes = {
	type: TBreakpoint,
	/**
	 * Define if this is the base breakpoint.
	 */
	base: boolean,
	/**
	 * Status of breakpoint
	 */
	status: boolean,
	label: TBreakpointLabel,
	settings: {
		min: string,
		max: string,
	},
	attributes?: Object,
	/**
	 * Define if this breakpoint on native blockera.
	 */
	native: boolean,
};
