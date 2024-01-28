// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TBackgroundProps = {
	...BaseExtensionProps,
	backgroundConfig: {
		publisherBackground: FeatureConfig,
		publisherBackgroundColor: FeatureConfig,
		publisherBackgroundClip: FeatureConfig,
	},
	values: {
		background: Object,
		backgroundClip: string,
		backgroundColor: string,
	},
	extensionProps: {
		publisherBackground: Object,
		publisherBackgroundColor: Object,
		publisherBackgroundClip: Object,
	},
};
