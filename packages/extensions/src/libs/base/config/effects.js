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
	force: true,
	status: true,
	label: __('Transform', 'publisher-core'),
};

const publisherTransition: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Transition', 'publisher-core'),
};

const publisherFilter: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Filter', 'publisher-core'),
};

const publisherBackdropFilter: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Backdrop Filter', 'publisher-core'),
};

const publisherBlendMode: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Blending Mode', 'publisher-core'),
};

const publisherDivider: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Divider', 'publisher-core'),
};

const publisherMask: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Mask', 'publisher-core'),
};

export const effectsConfig = {
	publisherOpacity,
	publisherTransform,
	publisherTransition,
	publisherFilter,
	publisherBackdropFilter,
	publisherBlendMode,
	publisherDivider,
	publisherMask,
};
