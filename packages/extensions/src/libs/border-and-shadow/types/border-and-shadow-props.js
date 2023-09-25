// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TBorderAndShadowDefaultProp = {
	borderColor?: string,
	border: {
		color?: string,
		style?: string,
		width?: string,
		top?: Object,
		left?: Object,
		right?: Object,
		bottom?: Object,
		radius?:
			| string
			| {
					topLeft: string,
					topRight: string,
					bottomLeft: string,
					bottomRight: string,
			  },
	},
};

export type TBorderAndShadowProps = {
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	values: {
		border: Object,
		outline: Object,
		boxShadow: Object,
		borderRadius: Object,
	},
	defaultValue: TBorderAndShadowDefaultProp,
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
