// @flow

/**
 * Blockera dependencies
 */
import type { TBreakpoint } from '../../../extensions/libs/block-states/types';

/**
 * Check if given breakpoint is base breakpoint
 *
 * @param {TBreakpoint} breakPoint The breakpoint to check.
 * @return {boolean} true on success, false on otherwise.
 */
export const isBaseBreakpoint = (breakPoint: TBreakpoint): boolean =>
	'laptop' === breakPoint;
