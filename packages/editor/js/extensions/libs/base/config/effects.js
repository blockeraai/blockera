// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraOpacity: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Opacity', 'blockera'),
	keywords: ['opacity', 'transparent', 'transparency', 'alpha'],
};

const blockeraTransform: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Transforms', 'blockera'),
	keywords: ['transform', 'rotate', 'scale', 'skew', 'translate'],
};

const blockeraTransformSelfPerspective: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Self Perspective', 'blockera'),
	showInSettings: false,
	onNative: true,
	keywords: ['transform', 'self', 'perspective', '3d'],
};

const blockeraBackfaceVisibility: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Backface Visibility', 'blockera'),
	showInSettings: false,
	onNative: true,
	keywords: ['backface', 'visibility', 'transform', '3d'],
};

const blockeraTransformChildPerspective: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Child Visibility', 'blockera'),
	showInSettings: false,
	onNative: true,
	keywords: ['child', 'perspective', 'transform', '3d'],
};

const blockeraTransition: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Transitions', 'blockera'),
	keywords: ['transition', 'animation', 'ease', 'duration'],
};

const blockeraFilter: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Filters', 'blockera'),
	keywords: ['filter', 'blur', 'brightness', 'contrast', 'saturate'],
};

const blockeraBackdropFilter: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Backdrop Filters', 'blockera'),
	keywords: ['backdrop', 'filter', 'blur', 'frosted', 'glass'],
};

let blockeraDivider: FeatureConfig | false = false;

if (experimental().get('editor.extensions.effectsExtension.divider')) {
	blockeraDivider = {
		show: true,
		force: false,
		status: true,
		label: __('Shape Dividers', 'blockera'),
		onStates: false,
		keywords: ['divider', 'shape', 'separator', 'wave'],
	};
}

let blockeraMask: FeatureConfig | false = false;

if (experimental().get('editor.extensions.effectsExtension.mask')) {
	blockeraMask = {
		show: true,
		force: false,
		status: true,
		label: __('Image Mask', 'blockera'),
		onStates: false,
		keywords: ['mask', 'image', 'clip', 'shape'],
	};
}

export const effectsConfig = {
	status: true,
	initialOpen: true,
	blockeraOpacity,
	blockeraTransform,
	blockeraTransformSelfPerspective,
	blockeraBackfaceVisibility,
	blockeraTransformChildPerspective,
	blockeraTransition,
	blockeraFilter,
	blockeraBackdropFilter,
	blockeraDivider,
	blockeraMask,
};
