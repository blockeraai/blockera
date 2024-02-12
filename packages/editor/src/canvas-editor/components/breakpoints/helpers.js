// @flow

/**
 * Publisher dependencies
 */
import type { TBreakpoint } from '@publisher/extensions/src/libs/block-states/types';

export const isLaptopBreakpoint = (device: TBreakpoint): boolean =>
	/laptop/i.test(device);
