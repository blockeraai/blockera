// @flow
/**
 * External dependencies
 */
import type { FeatureConfig } from '../../base';

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';

export type TAdvancedSettingsProps = {
	...BaseExtensionProps,
	values: {
		blockeraAttributes: Array<Object>,
	},
	extensionConfig: {
		blockeraAttributes: FeatureConfig,
	},
	extensionProps: {
		blockeraAttributes: Object,
	},
};
