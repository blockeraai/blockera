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
};

const blockeraTransform: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Transforms', 'blockera'),
};

const blockeraTransformSelfPerspective: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Self Perspective', 'blockera'),
	showInSettings: false,
	onNative: true,
};

const blockeraBackfaceVisibility: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Backface Visibility', 'blockera'),
	showInSettings: false,
	onNative: true,
};

const blockeraTransformChildPerspective: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Child Visibility', 'blockera'),
	showInSettings: false,
	onNative: true,
};

const blockeraTransition: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Transitions', 'blockera'),
};

const blockeraFilter: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Filters', 'blockera'),
};

const blockeraBackdropFilter: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Backdrop Filters', 'blockera'),
};

const blockeraBlendMode: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Blending Mode', 'blockera'),
};

let blockeraDivider: FeatureConfig | false = false;

if (experimental().get('editor.extensions.effectsExtension.divider'))
	blockeraDivider = {
		show: true,
		force: false,
		status: true,
		label: __('Shape Dividers', 'blockera'),
		onStates: false,
	};

let blockeraMask: FeatureConfig | false = false;

if (experimental().get('editor.extensions.effectsExtension.mask'))
	blockeraMask = {
		show: true,
		force: false,
		status: true,
		label: __('Image Mask', 'blockera'),
		onStates: false,
	};

export const effectsConfig = {
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
	blockeraBlendMode,
};
