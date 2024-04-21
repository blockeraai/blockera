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
	label: __('Opacity', 'blockera-core'),
};

const blockeraTransform: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('2D & 3D Transforms', 'blockera-core'),
};

const blockeraTransition: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Transitions', 'blockera-core'),
};

const blockeraFilter: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Filters', 'blockera-core'),
};

const blockeraBackdropFilter: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Backdrop Filters', 'blockera-core'),
};

const blockeraDivider: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Shape Dividers', 'blockera-core'),
	isActiveOnStates: ['normal'],
};

const blockeraMask: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Image Mask', 'blockera-core'),
	isActiveOnStates: ['normal'],
};

const blockeraBlendMode: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Blending Mode', 'blockera-core'),
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
