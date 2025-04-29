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
	breakpoint: TBreakpoint,
	children: any,
};

export type BlockStyleProps = {
	customCss?: string,
	clientId: string,
	supports: Object,
	blockName: string,
	selectors: Object,
	attributes: Object,
	inlineStyles: Object,
	defaultAttributes: Object,
	currentAttributes: Object,
	activeDeviceType: TStates,
};

export type StateStyleProps = {
	...BlockStyleProps,
	config: Object,
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
