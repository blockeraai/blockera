// @flow

/**
 * Publisher dependencies
 */
import type { InnerBlockModel } from '@publisher/extensions/src/libs/inner-blocks/types';

export type TUseCssSelectorProps = {
	query?: string,
	blockName?: string,
	supportId?: string,
	currentState: string,
	innerBlocks: Array<InnerBlockModel>,
	fallbackSupportId?: string,
};
