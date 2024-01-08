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
	'grid-column'?: string,
	'grid-row'?: string,
	'grid-area'?: string,
	'align-self'?: string,
	'justify-self'?: string,
	order?: string,
};

export type TGridChildProps = {
	values: {
		gridChildPosition: {
			'position-type': string,
			'column-span': string,
			'row-span': string,
			area: string,
			'column-start': string,
			'column-end': string,
			'row-start': string,
			'row-end': string,
		},
		gridChildAlign: string,
		gridChildJustify: string,
		gridChildOrder: string,
		gridChildOrderCustom: string,
		gridAreas: Array<Object>,
	},
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
