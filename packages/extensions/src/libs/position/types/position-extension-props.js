// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TPositionExtensionProps = {
	block: TBlockProps,
	positionConfig: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
	values: {
		position?: {
			type: string,
			position: {
				top: string,
				right: string,
				bottom: string,
				left: string,
			},
		},
		zIndex: string,
	},
	inheritValues: {
		position?: {
			type: string,
			position: {
				top: string,
				right: string,
				bottom: string,
				left: string,
			},
		},
	},
	extensionProps: {
		publisherPosition: Object,
		publisherZIndex: Object,
	},
};
