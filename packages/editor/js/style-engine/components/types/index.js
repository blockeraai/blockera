// @flow

/**
 * Internal dependencies
 */
import type {
	TBreakpoint,
	TStates,
} from '@blockera/editor/js/extensions/libs/block-states/types';
import type { InnerBlockType } from '@blockera/editor/js/extensions/libs/inner-blocks/types';

export type MediaQueryProps = {
	breakpoint: TBreakpoint,
	children: any,
};

export type BlockStyleProps = {
	clientId: string,
	supports: Object,
	blockName: string,
	attributes: Object,
	currentAttributes: Object,
	activeDeviceType: TStates,
};

export type StateStyleProps = {
	...BlockStyleProps,
	selectors?: Object,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
	currentBlock?: 'master' | InnerBlockType | string,
};

export type InnerBlockStyleProps = {
	...StateStyleProps,
};
