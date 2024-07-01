// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TSizeCssProps = {
	width?: string,
	'min-width'?: string,
	'max-width'?: string,
	height?: string,
	'min-height'?: string,
	'max-height'?: string,
	overflow?: string,
	'aspect-ratio'?: string,
	'object-fit'?: string,
	'object-position'?: string,
};

export type TSizeProps = {
	...BaseExtensionProps,
	extensionConfig: {
		blockeraWidth: FeatureConfig,
		blockeraMinWidth: FeatureConfig,
		blockeraMaxWidth: FeatureConfig,
		blockeraHeight: FeatureConfig,
		blockeraMinHeight: FeatureConfig,
		blockeraMaxHeight: FeatureConfig,
		blockeraOverflow: FeatureConfig,
		blockeraRatio: FeatureConfig,
		blockeraFit: FeatureConfig,
		blockeraFitPosition: FeatureConfig,
	},
	values: {
		blockeraWidth: string,
		blockeraHeight: string,
		blockeraMinWidth: string,
		blockeraMinHeight: string,
		blockeraMaxWidth: string,
		blockeraMaxHeight: string,
		blockeraOverflow: string,
		blockeraRatio: { value: string, width: string, height: string },
		blockeraFit: string,
		blockeraFitPosition: { top: string, left: string },
	},
	extensionProps: {
		blockeraWidth: Object,
		blockeraHeight: Object,
		blockeraMinWidth: Object,
		blockeraMinHeight: Object,
		blockeraMaxWidth: Object,
		blockeraMaxHeight: Object,
		blockeraOverflow: Object,
		blockeraRatio: Object,
		blockeraFit: Object,
		blockeraFitPosition: Object,
	},
};
