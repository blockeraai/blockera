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
	display?: string,
	'flex-direction'?: string,
	'align-items'?: string,
	'justify-content'?: string,
	'row-gap'?: string,
	gap?: string,
	'column-gap'?: string,
	'flex-wrap'?: string,
	'align-content'?: string,
};

export type TLayoutProps = {
	values: {
		gap: string,
		gapLock: boolean,
		gapRows: string,
		display: string,
		flexWrap: { value: string, reverse: boolean },
		gapColumns: string,
		alignItems: string,
		alignContent: string,
		flexDirection: { value: string, reverse: boolean },
		justifyContent: string,
	},
	// defaultValue: {
	// 	type?: string,
	// 	wideSize?: string,
	// 	contentSize?: string,
	// 	justifyContent?: string,
	// },
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
