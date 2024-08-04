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
		blockeraIcon: Object,
		blockeraIconGap: string,
		blockeraIconSize: string,
		blockeraIconLink: Object,
		blockeraIconColor: string,
		blockeraIconPosition: string,
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
