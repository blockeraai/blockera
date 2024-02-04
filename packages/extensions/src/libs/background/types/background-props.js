// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TBackgroundProps = {
	...BaseExtensionProps,
	extensionConfig: {
		publisherBackground: FeatureConfig,
		publisherBackgroundColor: FeatureConfig,
		publisherBackgroundClip: FeatureConfig,
	},
	values: {
		publisherBackground: Object,
		publisherBackgroundColor: string,
		publisherBackgroundClip: string,
	},
	extensionProps: {
		publisherBackground: Object,
		publisherBackgroundColor: Object,
		publisherBackgroundClip: Object,
	},
};
