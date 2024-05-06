// @flow

/**
 * Internal dependencies
 */
import type { BaseExtensionProps } from '../../types';
import type { FeatureConfig } from '../../base';

export type TTransformCssProps = {
	transform?: string,
	perspective?: string,
	'transform-origin'?: string,
	'perspective-origin'?: string,
	'backface-visibility'?: string,
};

export type TEffectsProps = {
	...BaseExtensionProps,
	values: {
		blockeraOpacity: string,
		blockeraTransform: Array<Object>,
		blockeraTransition: Array<Object>,
		blockeraFilter: Array<Object>,
		blockeraBlendMode: string,
		blockeraBackdropFilter: Array<Object>,
		blockeraTransformSelfPerspective: string,
		blockeraTransformSelfOrigin: {
			top: string,
			left: string,
		},
		blockeraBackfaceVisibility: string,
		blockeraTransformChildPerspective: string,
		blockeraTransformChildOrigin: {
			top: string,
			left: string,
		},
		blockeraDivider: Array<Object>,
	},
	extensionConfig: {
		blockeraOpacity: FeatureConfig,
		blockeraTransform: FeatureConfig,
		blockeraTransformSelfPerspective: FeatureConfig,
		blockeraTransformSelfOrigin: FeatureConfig,
		blockeraBackfaceVisibility: FeatureConfig,
		blockeraTransformChildPerspective: FeatureConfig,
		blockeraTransformChildOrigin: FeatureConfig,
		blockeraTransition: FeatureConfig,
		blockeraFilter: FeatureConfig,
		blockeraBackdropFilter: FeatureConfig,
		blockeraBlendMode: FeatureConfig,
		blockeraDivider: FeatureConfig,
	},
	extensionProps: {
		blockeraOpacity: Object,
		blockeraTransform: Object,
		blockeraTransformSelfPerspective: Object,
		blockeraTransformSelfOrigin: Object,
		blockeraBackfaceVisibility: Object,
		blockeraTransformChildPerspective: Object,
		blockeraTransformChildOrigin: Object,
		blockeraTransition: Object,
		blockeraFilter: Object,
		blockeraBackdropFilter: Object,
		blockeraBlendMode: Object,
		blockeraDivider: Object,
	},
};
