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
		blockeraBlendMode: FeatureConfig,
	},
	values: {
		blockeraBackground: Object,
		blockeraBackgroundColor: string,
		blockeraBackgroundClip: string,
		blockeraBlendMode: string,
	},
	extensionProps: {
		blockeraBackground: Object,
		blockeraBackgroundColor: Object,
		blockeraBackgroundClip: Object,
		blockeraBlendMode: Object,
	},
};
