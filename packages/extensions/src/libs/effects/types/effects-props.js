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
		opacity: string,
		transform: Array<Object>,
		transition: Array<Object>,
		filter: Array<Object>,
		blendMode: string,
		backdropFilter: Array<Object>,
		transformSelfPerspective: string,
		transformSelfOrigin: {
			top: string,
			left: string,
		},
		backfaceVisibility: string,
		transformChildPerspective: string,
		transformChildOrigin: {
			top: string,
			left: string,
		},
		divider: Array<Object>,
		mask: Array<Object>,
	},
	effectsConfig: {
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
