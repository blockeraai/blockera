// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraBackground: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Image & Gradient', 'blockera'),
};

const blockeraBackgroundColor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	isActiveOnInnerBlocksOnFree: true,
	label: __('Background Color', 'blockera'),
};

const blockeraBackgroundClip: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Background Clipping', 'blockera'),
};

const blockeraOverlay: FeatureConfig = {
	show: true,
	force: false,
	status: false,
	label: __('Overlay', 'blockera'),
};

export const backgroundConfig = {
	blockeraBackground,
	blockeraBackgroundColor,
	blockeraBackgroundClip,
	blockeraOverlay,
};
