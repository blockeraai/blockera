// @flow

/**
 * External dependencies
 */
import { default as memoize } from 'fast-memoize';

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type {
	TBreakpoint,
	BreakpointTypes,
} from '../../../extensions/libs/block-states/types';
import { default as defaultBreakpoints } from '../../../extensions/libs/block-states/default-breakpoints';

/**
 * Check if given breakpoint is base breakpoint
 *
 * @param {TBreakpoint} breakPoint The breakpoint to check.
 * @return {boolean} true on success, false on otherwise.
 */
export const isBaseBreakpoint = (breakPoint: TBreakpoint): boolean =>
	getBaseBreakpoint() === breakPoint;

/**
 * Get based breakpoint id.
 *
 * @return {string} the breakpoint identifier.
 */
export const getBaseBreakpoint = (): TBreakpoint => 'desktop';

/**
 * Get smallest breakpoint id.
 *
 * @param {Object} breakpoints Optional breakpoints object and if not provided will use default
 * @return {string} the breakpoint identifier.
 */
export const getSmallestBreakpoint: (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}) => TBreakpoint = memoize(function (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}): TBreakpoint {
	if (isUndefined(breakpoints)) breakpoints = defaultBreakpoints();

	let minBreakpoint = Infinity;

	let minBreakpointId: TBreakpoint = 'desktop';

	for (const key in breakpoints) {
		const typedKey: TBreakpoint = (key: any);

		const min = breakpoints[typedKey].settings.min;
		const max = breakpoints[typedKey].settings.max;

		if (min && !isNaN(parseInt(min, 10))) {
			const minValue = parseInt(min, 10);
			if (minValue < minBreakpoint) {
				minBreakpoint = minValue;
				minBreakpointId = typedKey;
			}
		} else if (!min && max && !isNaN(parseInt(max, 10))) {
			const maxValue = parseInt(max, 10);
			if (maxValue < minBreakpoint) {
				minBreakpoint = maxValue;
				minBreakpointId = typedKey;
			}
		}
	}

	return minBreakpointId;
});

/**
 * Get largest breakpoint id.
 *
 * @param {Object} breakpoints Optional breakpoints object and if not provided will use default
 * @return {string} the breakpoint ID.
 */
export const getLargestBreakpoint: (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}) => TBreakpoint = memoize(function (breakpoints?: {
	[key: TBreakpoint]: BreakpointTypes,
}): TBreakpoint {
	if (isUndefined(breakpoints)) breakpoints = defaultBreakpoints();

	let maxBreakpoint = -Infinity;

	let maxBreakpointId = 'desktop';

	for (const key in breakpoints) {
		const typedKey: TBreakpoint = (key: any);

		const min = breakpoints[typedKey].settings.min;
		const max = breakpoints[typedKey].settings.max;

		if (max && !isNaN(parseInt(max, 10))) {
			const maxValue = parseInt(max, 10);
			if (maxValue > maxBreakpoint) {
				maxBreakpoint = maxValue;
				maxBreakpointId = typedKey;
			}
		} else if (!max && min && !isNaN(parseInt(min, 10))) {
			const minValue = parseInt(min, 10);
			if (minValue > maxBreakpoint) {
				maxBreakpoint = minValue;
				maxBreakpointId = typedKey;
			}
		}
	}

	return maxBreakpointId;
});
