// @flow

/**
 * Publisher dependencies
 */
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';
import type { InnerBlocks } from '@publisher/extensions/src/libs/inner-blocks/types';

export type TUseCssSelectorProps = {
	query?: string,
	blockName?: string,
	supportId?: string,
	currentState: TStates,
	innerBlocks: InnerBlocks,
	fallbackSupportId?: string,
};
