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
		flexDirection: string,
		flexChildAlign?: string,
		flexChildBasis?: string,
		flexChildOrder?: string,
		flexChildSizing?: string,
		flexChildShrink?: string,
		flexChildOrderCustom?: string,
	},
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
