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
	'min-width'?: string,
	'max-width'?: string,
	height?: string,
	'min-height'?: string,
	'max-height'?: string,
	overflow?: string,
	'aspect-ratio'?: string,
	'object-fit'?: string,
	'object-position'?: string,
};

export type TSizeProps = {
	block: TBlockProps,
	sizeConfig: Object,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: {
		width: string,
		height: string,
		minWidth: string,
		minHeight: string,
		maxWidth: string,
		maxHeight: string,
		overflow: string,
		ratio: { value: string, width: string, height: string },
		fit: string,
		fitPosition: { top: string, left: string },
	},
	extensionProps: {
		publisherWidth: Object,
		publisherHeight: Object,
		publisherMinWidth: Object,
		publisherMinHeight: Object,
		publisherMaxWidth: Object,
		publisherMaxHeight: Object,
		publisherOverflow: Object,
		publisherRatio: Object,
		publisherFit: Object,
		publisherFitPosition: Object,
	},
	children?: MixedElement,
};
