// @flow
/**
 * Internal dependencies
 */
import states from './states';
import breakpoints from './default-breakpoints';
import type {
	StateTypes,
	BreakpointTypes,
	TBreakpoint,
	TStates,
} from './types';

export const getStateInfo = (state: TStates | number): StateTypes => {
	return 'number' === typeof state
		? Object.values(states)[state]
		: states[state];
};

export const getBreakpointInfo = (
	breakpoint: TBreakpoint | number,
	parentState: TStates = 'normal'
): BreakpointTypes | void => {
	return 'number' === typeof breakpoint
		? breakpoints()[breakpoint]
		: breakpoints(parentState).find((b: BreakpointTypes): boolean => {
				return [b.type, b.label].includes(breakpoint);
		  });
};
