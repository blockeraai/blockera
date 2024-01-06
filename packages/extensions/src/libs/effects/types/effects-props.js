// @flow
/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

export type TTransformCssProps = {
	transform?: string,
	perspective?: string,
	'transform-origin'?: string,
	'perspective-origin'?: string,
	'backface-visibility'?: string,
};

export type TEffectsProps = {
	values: {
		opacity: string,
		transform: Array<Object>,
		transition: Array<Object>,
		filter: Array<Object>,
		blendMode: string,
		backdropFilter: Array<Object>,
		backfaceVisibility: string,
		transformSelfOrigin: {
			top: string,
			left: string,
		},
		transformChildOrigin: {
			top: string,
			left: string,
		},
		transformSelfPerspective: string,
		transformChildPerspective: string,
		divider: Array<Object>,
		mask: Array<Object>,
	},
	block: TBlockProps,
	config: Object,
	children?: MixedElement,
	handleOnChangeAttributes: THandleOnChangeAttributes,
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
