// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TIconStateAttributes = {
	blockeraIcon: Object,
	blockeraIconGap: string,
	blockeraIconSize?: string,
	blockeraIconLink: Object,
	blockeraIconColor: string,
	blockeraIconPosition: string,
	blockeraIconRotate: string,
	blockeraIconFlipHorizontal: string,
	blockeraIconFlipVertical: string,
	blockeraWidth?: string,
	[key: string]: any,
};

export type TIconProps = {
	block: TBlockProps,
	iconConfig: Object,
	children?: MixedElement,
	currentStateAttributes: TIconStateAttributes,
	attributes: Object,
	useBlockSection: (id: string) => Object,
	activeSearchMode?: boolean,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	extensionProps: {
		blockeraIcon: Object,
		blockeraIconPosition: Object,
		blockeraIconGap: Object,
		blockeraIconSize: Object,
		blockeraIconColor: Object,
		blockeraIconLink: Object,
		blockeraIconRotate: Object,
		blockeraIconFlipHorizontal: Object,
		blockeraIconFlipVertical: Object,
	},
};
