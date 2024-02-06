// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

export type InnerBlockType = 'heading' | 'paragraph' | 'icon' | 'button';

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
};

export type InnerBlocksProps = {
	innerBlocks: Array<Object>,
};
