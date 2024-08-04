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
		blockeraFlexChildSizing?: string,
		blockeraFlexChildGrow?: string,
		blockeraFlexChildShrink?: string,
		blockeraFlexChildBasis?: string,
		blockeraFlexChildAlign?: string,
		blockeraFlexChildOrder?: string,
		blockeraFlexChildOrderCustom?: string,
		blockeraFlexDirection: string,
	},
	extensionConfig: {
		blockeraFlexChildSizing: FeatureConfig,
		blockeraFlexChildAlign: FeatureConfig,
		blockeraFlexChildOrder: FeatureConfig,
	},
	extensionProps: {
		blockeraFlexChildSizing: Object,
		blockeraFlexChildGrow: Object,
		blockeraFlexChildShrink: Object,
		blockeraFlexChildBasis: Object,
		blockeraFlexChildAlign: Object,
		blockeraFlexChildOrder: Object,
		blockeraFlexChildOrderCustom: Object,
	},
};
