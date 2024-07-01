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
		isActiveOnStates: false,
	};

let blockeraMask: FeatureConfig | false = false;

if (experimental().get('editor.extensions.effectsExtension.mask'))
	blockeraMask = {
		show: true,
		force: false,
		status: true,
		label: __('Image Mask', 'blockera'),
		isActiveOnStates: false,
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
