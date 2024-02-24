// @flow

import type { TBreakpoint } from './breakpoint-types';
import type { BlockStates, TStates } from './state-types';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export * from './prop-types';
export * from './state-types';
export * from './breakpoint-types';

export type BlockDetail = {
	blockId: string,
	blockClientId?: string,
	isNormalState: boolean,
	isMasterBlock: boolean,
	isBaseBreakpoint: boolean,
	currentBlock: 'master' | string,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
};

export type StatesManagerProps = {
	block: {
		...TBlockProps,
		attributes?: Object,
	},
	states: BlockStates,
	onChange: THandleOnChangeAttributes,
};
