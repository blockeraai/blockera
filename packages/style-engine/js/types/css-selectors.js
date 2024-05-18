// @flow

/**
 * Blockera dependencies
 */
import type {
	TStates,
	TBreakpoint,
} from '@blockera/editor/js/extensions/libs/block-states/types';
import type { InnerBlockType } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

export type NormalizedSelectorProps = {
	query?: string,
	state: TStates,
	clientId: string,
	support?: string,
	className?: string,
	suffixClass?: string,
	device?: TBreakpoint,
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
