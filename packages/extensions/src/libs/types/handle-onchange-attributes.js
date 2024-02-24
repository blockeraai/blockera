// @flow

/**
 * Publisher dependencies
 */
import type { ControlContextRef } from '@publisher/controls/src/context/types';

export type THandleOnChangeAttributes = (
	attributeId: string,
	newValue: any,
	// eslint-disable-next-line
	options: {
		ref?: ControlContextRef,
	}
) => void;
