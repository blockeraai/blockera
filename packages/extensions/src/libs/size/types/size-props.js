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
	'aspect-ratio'?: string,
	'object-fit'?: string,
	'object-position'?: string,
};

export type TSizeProps = {
	width: string,
	height: string,
	overflow: string,
	ratio: { value: string, width: string, height: string },
	fit: string,
	fitPosition: { top: string, left: string },
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
