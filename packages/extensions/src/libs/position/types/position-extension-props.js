// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TPositionExtensionProps = {
	...BaseExtensionProps,
	extensionConfig: {
		publisherPosition: FeatureConfig,
		publisherZIndex: FeatureConfig,
	},
	values: {
		publisherPosition?: {
			type: string,
			position: {
				top: string,
				right: string,
				bottom: string,
				left: string,
			},
		},
		publisherZIndex: string,
	},
	extensionProps: {
		publisherPosition: Object,
		publisherZIndex: Object,
	},
};
