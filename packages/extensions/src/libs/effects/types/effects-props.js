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
		publisherOpacity: string,
		publisherTransform: Array<Object>,
		publisherTransition: Array<Object>,
		publisherFilter: Array<Object>,
		publisherBlendMode: string,
		publisherBackdropFilter: Array<Object>,
		publisherTransformSelfPerspective: string,
		publisherTransformSelfOrigin: {
			top: string,
			left: string,
		},
		publisherBackfaceVisibility: string,
		publisherTransformChildPerspective: string,
		publisherTransformChildOrigin: {
			top: string,
			left: string,
		},
		publisherDivider: Array<Object>,
		publisherMask: Array<Object>,
	},
	extensionConfig: {
		publisherOpacity: FeatureConfig,
		publisherTransform: FeatureConfig,
		publisherTransformSelfPerspective: FeatureConfig,
		publisherTransformSelfOrigin: FeatureConfig,
		publisherBackfaceVisibility: FeatureConfig,
		publisherTransformChildPerspective: FeatureConfig,
		publisherTransformChildOrigin: FeatureConfig,
		publisherTransition: FeatureConfig,
		publisherFilter: FeatureConfig,
		publisherBackdropFilter: FeatureConfig,
		publisherDivider: FeatureConfig,
		publisherMask: FeatureConfig,
		publisherBlendMode: FeatureConfig,
	},
	extensionProps: {
		publisherOpacity: Object,
		publisherTransform: Object,
		publisherTransformSelfPerspective: Object,
		publisherTransformSelfOrigin: Object,
		publisherBackfaceVisibility: Object,
		publisherTransformChildPerspective: Object,
		publisherTransformChildOrigin: Object,
		publisherTransition: Object,
		publisherFilter: Object,
		publisherBackdropFilter: Object,
		publisherDivider: Object,
		publisherBlendMode: Object,
		publisherMask: Object,
	},
};
