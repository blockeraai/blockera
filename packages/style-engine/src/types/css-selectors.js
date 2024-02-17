// @flow

/**
 * Publisher dependencies
 */
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';
import type { InnerBlockType } from '@publisher/extensions/src/libs/inner-blocks/types';

export type TUseCssSelectorsProps = {
	query?: string,
	supportId?: string,
	currentState: TStates,
	blockSelectors: Object,
	fallbackSupportId?: string,
	currentBlock: 'master' | InnerBlockType | string,
};

export type TUseCssSelectors = {
	[key: TStates]: {
		[key: 'master' | InnerBlockType | string]: string,
	},
};
