// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

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
	label: __('2D & 3D Transforms', 'blockera'),
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

const blockeraDivider: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Shape Dividers', 'blockera'),
	isActiveOnStates: ['normal'],
};

const blockeraMask: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Image Mask', 'blockera'),
	isActiveOnStates: ['normal'],
};

const blockeraBlendMode: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Blending Mode', 'blockera'),
};

export const effectsConfig = {
	blockeraOpacity,
	blockeraTransform,
	blockeraTransition,
	blockeraFilter,
	blockeraBackdropFilter,
	blockeraDivider,
	blockeraMask,
	blockeraBlendMode,
};
