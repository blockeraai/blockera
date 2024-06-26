// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TSpacingDefaultProps = {
	margin: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
	padding: {
		top: string,
		right: string,
		bottom: string,
		left: string,
	},
};

export type TCssProps = {
	'margin-top'?: string,
	'margin-right'?: string,
	'margin-bottom'?: string,
	'margin-left'?: string,
	'padding-top'?: string,
	'padding-right'?: string,
	'padding-bottom'?: string,
	'padding-left'?: string,
};

export type TSpacingProps = {
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	spacingValue: {},
	defaultValue: TSpacingDefaultProps,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
