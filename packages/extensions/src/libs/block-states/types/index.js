// @flow

import type { TBreakpoint } from './breakpoint-types';
import type { TStates } from './state-types';

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
};
