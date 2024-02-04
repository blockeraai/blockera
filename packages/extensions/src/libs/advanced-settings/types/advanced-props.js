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
		publisherAttributes: Array<Object>,
	},
	extensionConfig: {
		publisherAttributes: FeatureConfig,
	},
	extensionProps: {
		publisherAttributes: Object,
	},
};
