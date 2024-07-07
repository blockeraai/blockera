// @flow

import type { TBreakpoint } from './breakpoint-types';
import type { StateTypes, TStates } from './state-types';
import type { InnerBlockType } from '../../inner-blocks/types';
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
	blockAttributes: Object,
	variations: Array<Object>,
	activeBlockVariation: Object,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
	innerBlocks: Object,
};

export type StatesManagerProps = {
	block: {
		...TBlockProps,
		attributes?: Object,
	},
	attributes: {
		...Object,
		blockeraBlockStates: {
			[key: TStates]: {
				isVisible: boolean,
				breakpoints: {
					[key: TBreakpoint]: {
						attributes: Object,
					},
				},
			},
		},
	},
	onChange: THandleOnChangeAttributes,
	currentBlock: 'master' | InnerBlockType,
	currentState: TStates,
	availableStates: { [key: TStates | string]: StateTypes },
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
};
