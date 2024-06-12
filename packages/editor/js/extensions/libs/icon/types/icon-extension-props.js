// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TIconProps = {
	block: TBlockProps,
	iconConfig: Object,
	children?: MixedElement,
	values: {
		icon: Object,
		iconGap: string,
		iconSize: string,
		iconLink: Object,
		iconColor: string,
		iconPosition: string,
	},
	handleOnChangeAttributes: THandleOnChangeAttributes,
	extensionProps: {
		blockeraIcon: Object,
		blockeraIconPosition: Object,
		blockeraIconGap: Object,
		blockeraIconSize: Object,
		blockeraIconColor: Object,
		blockeraIconLink: Object,
	},
};
