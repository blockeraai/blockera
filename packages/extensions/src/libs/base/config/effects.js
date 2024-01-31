// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherOpacity: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Opacity', 'publisher-core'),
};

const publisherTransform: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('2D & 3D Transforms', 'publisher-core'),
};

const publisherTransition: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Transitions', 'publisher-core'),
};

const publisherFilter: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Filters', 'publisher-core'),
};

const publisherBackdropFilter: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Backdrop Filters', 'publisher-core'),
};

const publisherDivider: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Shape Dividers', 'publisher-core'),
};

const publisherMask: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Image Mask', 'publisher-core'),
};

const publisherBlendMode: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Blending Mode', 'publisher-core'),
};

export const effectsConfig = {
	publisherOpacity,
	publisherTransform,
	publisherTransition,
	publisherFilter,
	publisherBackdropFilter,
	publisherDivider,
	publisherMask,
	publisherBlendMode,
};
