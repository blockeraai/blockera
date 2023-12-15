// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TAdvancedProps = {
	attributes: Array<Object>,
	properties: Array<Object>,
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
