// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TBackgroundProps = {
	...BaseExtensionProps,
	extensionConfig: {
		blockeraBackground: FeatureConfig,
		blockeraBackgroundColor: FeatureConfig,
		blockeraBackgroundClip: FeatureConfig,
		blockeraOverlay: FeatureConfig,
	},
	values: {
		blockeraBackground: Object,
		blockeraBackgroundColor: string,
		blockeraBackgroundClip: string,
		blockeraOverlay: Object,
	},
	extensionProps: {
		blockeraBackground: Object,
		blockeraBackgroundColor: Object,
		blockeraBackgroundClip: Object,
		blockeraOverlay: Object,
	},
};
