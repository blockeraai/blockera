// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

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
	innerBlockSettings: {
		force?: boolean,
	},
	...Object,
};

export type InnerBlocks = { [key: InnerBlockType | string]: InnerBlockModel };

export type InnerBlocksProps = {
	innerBlocks: InnerBlocks,
};
