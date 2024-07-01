// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TPositionExtensionProps = {
	...BaseExtensionProps,
	extensionConfig: {
		blockeraPosition: FeatureConfig,
		blockeraZIndex: FeatureConfig,
	},
	values: {
		blockeraPosition?: {
			type: string,
			position: {
				top: string,
				right: string,
				bottom: string,
				left: string,
			},
		},
		blockeraZIndex: string,
	},
	extensionProps: {
		blockeraPosition: Object,
		blockeraZIndex: Object,
	},
};
