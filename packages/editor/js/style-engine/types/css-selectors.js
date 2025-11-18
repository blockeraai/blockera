// @flow

/**
 * Blockera dependencies
 */
import type {
	TStates,
	TBreakpoint,
} from '../../extensions/libs/block-card/block-states/types';
import type {
	InnerBlocks,
	InnerBlockType,
} from '../../extensions/libs/block-card/inner-blocks/types';

export type NormalizedSelectorProps = {
	state: TStates,
	clientId: string,
	support?: string,
	supports?: Object,
	blockName: string,
	className?: string,
	suffixClass?: string,
	device?: TBreakpoint,
	masterState?: TStates,
	blockSelectors: Object,
	isStyleVariation?: boolean,
	styleEngineConfig?: Object,
	styleVariationName?: string,
	query?: Array<string> | string,
	activeDeviceType?: TBreakpoint,
	isGlobalStylesWrapper?: boolean,
	blockeraInnerBlocks?: InnerBlocks,
	currentStateHasSelectors?: boolean,
	fallbackSupportId?: string | Array<string>,
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
