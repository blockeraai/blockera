// @flow

/**
 * Blockera dependencies
 */
import type { ControlContextRef } from '@blockera/controls/js/context/types';

export type THandleOnChangeAttributes = (
	attributeId: string,
	newValue: any,
	// eslint-disable-next-line
	options: {
		ref?: ControlContextRef,
		effectiveItems?: Object,
	}
) => void;
