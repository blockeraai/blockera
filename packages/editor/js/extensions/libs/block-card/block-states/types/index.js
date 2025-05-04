// @flow

/**
 * External dependencies
 */
import type { MixedElement, ComponentType } from 'react';

/**
 * Internal dependencies
 */
import type { TBreakpoint } from './breakpoint-types';
import type { StateTypes, TStates } from './state-types';
import type { InnerBlockType } from '../../inner-blocks/types';
import type { TBlockProps, THandleOnChangeAttributes } from '../../../types';

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

export type StatesManagerHookProps = {
	id: string,
	children: MixedElement,
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
	deleteCacheData: Object,
	needsToMergeWithGeneral: boolean,
	onChange: THandleOnChangeAttributes,
	currentBlock: 'master' | InnerBlockType,
	currentState: TStates,
	availableStates: { [key: TStates | string]: StateTypes },
	currentBreakpoint: TBreakpoint,
	currentInnerBlockState: TStates,
};

export type StatesManagerProps = {
	// id: string,
	children: any,
	maxItems: number,
	contextValue: Object,
	deleteCacheData: Object,
	defaultRepeaterItemValue: Object,
	onDelete: (index: number) => void,
	InserterComponent: ComponentType<any>,
	overrideItem: (index: number) => void,
	// currentBlock: 'master' | InnerBlockType,
	states: { [key: TStates | string]: StateTypes },
	handleOnChange: (index: number, value: Object) => void,
	defaultStates: { [key: TStates | string]: StateTypes },
	preparedStates: { [key: TStates | string]: StateTypes },
	getDynamicDefaultRepeaterItem: (index: number) => Object,
};
