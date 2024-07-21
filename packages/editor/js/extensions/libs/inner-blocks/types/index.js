// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

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
	},
	...Object,
};

export type InnerBlocks = { [key: InnerBlockType | string]: InnerBlockModel };

export type InnerBlocksProps = {
	values: InnerBlocks,
	innerBlocks: InnerBlocks,
	block: {
		...TBlockProps,
		attributes?: Object,
	},
	onChange: THandleOnChangeAttributes,
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
	setBlockClientInners: ({
		clientId: string,
		inners: InnerBlocks,
	}) => void,
	selectedBlockName: string,
	reservedInnerBlocks: InnerBlocks,
	memoizedInnerBlocks: InnerBlocks,
	insertedInnerBlocks: Array<InnerBlockType>,
	getBlockInners: (clientId: string) => InnerBlocks,
};
