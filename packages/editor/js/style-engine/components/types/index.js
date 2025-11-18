// @flow

/**
 * Internal dependencies
 */
import type {
	TBreakpoint,
	TStates,
} from '../../../extensions/libs/block-card/block-states/types';
import type { InnerBlockType } from '../../../extensions/libs/block-card/inner-blocks/types';

export type MediaQueryProps = {
	clientId: string,
	declarations: string,
	breakpoint: TBreakpoint,
};

export type BlockStyleProps = {
	customCss?: string,
	clientId: string,
	supports: Object,
	blockName: string,
	selectors: Object,
	attributes: Object,
	additional: Object,
	inlineStyles: Object,
	defaultAttributes: Object,
	currentAttributes: Object,
	activeDeviceType: TStates,
	isGlobalStylesWrapper?: boolean,
	styleVariationName?: string,
	isStyleVariation?: boolean,
};

export type StateStyleProps = {
	...BlockStyleProps,
	config: Object,
	additional: Object,
	selectors?: Object,
	currentState: TStates,
	styleEngineConfig?: Object,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
	currentBlock?: 'master' | InnerBlockType | string,
};

export type InnerBlockStyleProps = {
	...StateStyleProps,
};
