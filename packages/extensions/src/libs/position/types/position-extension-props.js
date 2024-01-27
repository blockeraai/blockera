// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';
import type { FeatureConfig } from '../../base';

export type TPositionExtensionProps = {
	block: TBlockProps,
	positionConfig: {
		publisherPosition: FeatureConfig,
		publisherZIndex: FeatureConfig,
	},
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
	extensionProps: {
		publisherPosition: Object,
		publisherZIndex: Object,
	},
};
