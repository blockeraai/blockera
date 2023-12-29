// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import type { BorderRadiusValue } from '@publisher/controls';

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
		radius?: BorderRadiusValue,
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
