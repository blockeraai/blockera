// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TGridChildProps = {
	...BaseExtensionProps,
	values: {
		blockeraGridChildColumnSpan?: Object | string | number,
		blockeraGridChildRowSpan?: Object | string | number,
	},
	extensionConfig: {
		blockeraGridChildColumnSpan: FeatureConfig,
		blockeraGridChildRowSpan: FeatureConfig,
	},
	extensionProps: {
		blockeraGridChildColumnSpan: Object,
		blockeraGridChildRowSpan: Object,
	},
};
