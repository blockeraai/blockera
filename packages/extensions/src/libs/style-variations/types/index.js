// @flow
/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type StyleVariationsExtensionProps = {
	...BaseExtensionProps,
	extensionConfig: {
		publisherStyleVariation: FeatureConfig,
	},
};
