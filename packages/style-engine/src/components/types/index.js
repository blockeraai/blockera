// @flow

/**
 * Internal dependencies
 */
import type {
	TBreakpoint,
	TStates,
} from '@publisher/extensions/src/libs/block-states/types';
import type { InnerBlockType } from '@publisher/extensions/src/libs/inner-blocks/types';

export type MediaQueryProps = {
	breakpoint: TBreakpoint,
	children: any,
};

export type BlockStyleProps = {
	clientId: string,
	supports: Object,
	blockName: string,
	attributes: Object,
	activeDeviceType: TStates,
};

export type StateStyleProps = {
	...BlockStyleProps,
	selectors?: Object,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentBlock?: 'master' | InnerBlockType | string,
};

export type InnerBlockStyleProps = {
	...StateStyleProps,
};
