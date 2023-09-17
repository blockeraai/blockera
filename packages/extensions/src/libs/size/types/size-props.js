// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TSizeCssProps = {
	width?: string,
	height?: string,
	overflow?: string,
};

export type TSizeProps = {
	width: string,
	height: string,
	overflow: string,
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	defaultValue: {
		width?: string,
		height?: string,
		overflow?: string,
	},
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
