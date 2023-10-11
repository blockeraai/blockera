// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TBackgroundProps = {
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	values: {
		background: Object,
		backgroundClip: string,
		backgroundColor: string,
	},
	defaultValue: {
		backgroundSize?: string,
		backgroundImage?: string,
	},
	handleOnChangeAttributes: THandleOnChangeAttributes,
};
