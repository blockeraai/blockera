// @flow

/**
 * Blockera dependencies
 */
import type {
	TStates,
	TBreakpoint,
} from '../../extensions/libs/block-card/block-states/types';
import type { InnerBlockType } from '../../extensions/libs/block-card/inner-blocks/types';

export type NormalizedSelectorProps = {
	query?: string,
	state: TStates,
	clientId: string,
	support?: string,
	supports?: Object,
	blockName: string,
	className?: string,
	masterState?: TStates,
	suffixClass?: string,
	device?: TBreakpoint,
	blockSelectors: Object,
	fallbackSupportId?: string | Array<string>,
	styleEngineConfig?: Object,
	activeDeviceType?: TBreakpoint,
	currentStateHasSelectors?: boolean,
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
