// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';
/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TIconProps = {
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	values: {
		icon: Object,
		iconGap: string,
		iconSize: string,
		iconLink: Object,
		iconColor: string,
		iconPosition: string,
	},
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
