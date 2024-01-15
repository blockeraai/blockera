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
		publisherIcon: Object,
		publisherIconPosition: Object,
		publisherIconGap: Object,
		publisherIconSize: Object,
		publisherIconColor: Object,
		publisherIconLink: Object,
	},
};
