// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TPositionExtensionProps = {
	...BaseExtensionProps,
	positionConfig: {
		publisherPosition: FeatureConfig,
		publisherZIndex: FeatureConfig,
	},
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
