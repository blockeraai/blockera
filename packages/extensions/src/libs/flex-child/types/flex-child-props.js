// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TCssProps = {
	flex?: string,
	order?: string,
	'align-self'?: string,
};

export type TFlexChildProps = {
	...BaseExtensionProps,
	values: {
		publisherFlexChildSizing?: string,
		publisherFlexChildGrow?: string,
		publisherFlexChildShrink?: string,
		publisherFlexChildBasis?: string,
		publisherFlexChildAlign?: string,
		publisherFlexChildOrder?: string,
		publisherFlexChildOrderCustom?: string,
		publisherFlexDirection: string,
	},
	extensionConfig: {
		publisherFlexChildSizing: FeatureConfig,
		publisherFlexChildAlign: FeatureConfig,
		publisherFlexChildOrder: FeatureConfig,
	},
	extensionProps: {
		publisherFlexChildSizing: Object,
		publisherFlexChildGrow: Object,
		publisherFlexChildShrink: Object,
		publisherFlexChildBasis: Object,
		publisherFlexChildAlign: Object,
		publisherFlexChildOrder: Object,
		publisherFlexChildOrderCustom: Object,
	},
};
