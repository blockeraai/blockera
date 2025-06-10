// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import type { TBlockProps, THandleOnChangeAttributes } from '../../../types';
import type {
	TStates,
	TBreakpoint,
	StateTypes,
} from '../../block-states/types';

export type InnerBlockType =
	| 'heading'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'paragraph'
	| 'icon'
	| 'citation'
	| 'button';

export type InnerBlockModel = {
	name: string,
	type: InnerBlockType,
	label: string,
	icon?: MixedElement,
	selectors?: {
		root: string,
		[key: string]: string,
	},
	attributes: Object,
	settings: {
		force?: boolean,
		priority?: number,
	},
	availableBlockStates?: { [key: TStates]: StateTypes },
	...Object,
};

export type InnerBlocks = { [key: InnerBlockType | string]: InnerBlockModel };

export type InnerBlocksProps = {
	values: InnerBlocks,
	currentState: TStates,
	currentBreakpoint: TBreakpoint,
	innerBlocks: InnerBlocks,
	block: {
		...TBlockProps,
		attributes?: Object,
	},
	onChange: THandleOnChangeAttributes,
	maxItems: number,
	contextValue: Object,
	setCurrentBlock: (block: InnerBlockType) => void,
	setBlockClientInners: ({
		clientId: string,
		inners: InnerBlocks,
	}) => void,
};

export type MemoizedInnerBlocks = {
	clientId: string,
	setBlockClientInners: ({
		clientId: string,
		inners: InnerBlocks,
	}) => void,
	controlValue: InnerBlocks,
	reservedInnerBlocks: InnerBlocks,
	getBlockInners: (clientId: string) => InnerBlocks,
};

export type AvailableItems = {
	clientId: string,
	maxItems?: number | void,
	setBlockClientInners: ({
		clientId: string,
		inners: InnerBlocks,
	}) => void,
	reservedInnerBlocks: InnerBlocks,
	memoizedInnerBlocks: InnerBlocks,
	getBlockInners: (clientId: string) => InnerBlocks,
};
