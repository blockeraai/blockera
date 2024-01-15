// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TCssProps = {
	flex?: string,
	order?: string,
	'align-self'?: string,
};

export type TFlexChildProps = {
	values: {
		flexChildGrow?: string,
		flexChildAlign?: string,
		flexChildBasis?: string,
		flexChildOrder?: string,
		flexChildSizing?: string,
		flexChildShrink?: string,
		flexChildOrderCustom?: string,
		flexDirection: string,
	},
	block: TBlockProps,
	flexChildConfig: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	extensionProps: {
		publisherFlexChildSizing: Object,
		publisherFlexChildGrow: Object,
		publisherFlexChildShrink: Object,
		publisherFlexChildBasis: Object,
		publisherFlexChildAlign: Object,
		publisherFlexChildOrder: Object,
		publisherFlexChildOrderCustom: Object,
	},
};
