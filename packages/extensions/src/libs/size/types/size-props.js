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
		publisherWidth: FeatureConfig,
		publisherMinWidth: FeatureConfig,
		publisherMaxWidth: FeatureConfig,
		publisherHeight: FeatureConfig,
		publisherMinHeight: FeatureConfig,
		publisherMaxHeight: FeatureConfig,
		publisherOverflow: FeatureConfig,
		publisherRatio: FeatureConfig,
		publisherFit: FeatureConfig,
		publisherFitPosition: FeatureConfig,
	},
	values: {
		publisherWidth: string,
		publisherHeight: string,
		publisherMinWidth: string,
		publisherMinHeight: string,
		publisherMaxWidth: string,
		publisherMaxHeight: string,
		publisherOverflow: string,
		publisherRatio: { value: string, width: string, height: string },
		publisherFit: string,
		publisherFitPosition: { top: string, left: string },
	},
	extensionProps: {
		publisherWidth: Object,
		publisherHeight: Object,
		publisherMinWidth: Object,
		publisherMinHeight: Object,
		publisherMaxWidth: Object,
		publisherMaxHeight: Object,
		publisherOverflow: Object,
		publisherRatio: Object,
		publisherFit: Object,
		publisherFitPosition: Object,
	},
};
