// @flow

import type { MixedElement } from 'react';
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
	blockVariations: Array<Object>,
	activeBlockVariation: Object,
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
	innerBlocks: Object,
	isMasterNormalState: boolean,
	getActiveBlockVariation: (name: string, attrs: Object) => boolean,
};

export type StatesManagerProps = {
	id: string,
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
	children: MixedElement,
	onChange: THandleOnChangeAttributes,
	currentBlock: 'master' | InnerBlockType,
	currentState: TStates,
	availableStates: { [key: TStates | string]: StateTypes },
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
};

export type StatesManagerUtils = {
	states: { [key: TStates]: StateTypes },
	onDelete: (itemId: TStates, items: { [key: TStates]: Object }) => Object,
	contextValue: Object,
	valueCleanup: (value: Object) => Object,
	overrideItem: (item: Object) => Object,
	defaultStates: { [key: TStates]: StateTypes },
	preparedStates: { [key: TStates]: StateTypes },
	calculatedValue: { [key: TStates]: StateTypes },
	defaultRepeaterItemValue: Object,
	getDynamicDefaultRepeaterItem: (
		statesCount: number,
		defaultRepeaterItemValue: Object
	) => Object,
	handleOnChange: (newValue: Object) => void,
};

export type PickerProps = {
	...StatesManagerUtils,
	id: string,
	children: MixedElement,
	currentBlock: 'master' | InnerBlockType,
};
