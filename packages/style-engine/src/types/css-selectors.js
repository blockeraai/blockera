// @flow

/**
 * Publisher dependencies
 */
import type { TStates } from '@publisher/extensions/src/libs/block-states/types';
import type { InnerBlockType } from '@publisher/extensions/src/libs/inner-blocks/types';

export type NormalizedSelectorProps = {
	query?: string,
	state: TStates,
	clientId: string,
	support?: string,
	className?: string,
	blockSelectors: Object,
	fallbackSupportId?: string,
	currentBlock: 'master' | InnerBlockType | string,
};

export type TUseCssSelectors = {
	[key: TStates]: {
		[key: 'master' | InnerBlockType | string]: string,
	},
};

export type CssRule = {
	selector: string,
	declarations: Object,
};
