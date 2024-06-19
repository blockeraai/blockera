// @flow

/**
 * Blockera dependencies
 */
import type { TBreakpoint } from '../../../extensions/libs/block-states/types';

export const isLaptopBreakpoint = (device: TBreakpoint): boolean =>
	/laptop/i.test(device);
