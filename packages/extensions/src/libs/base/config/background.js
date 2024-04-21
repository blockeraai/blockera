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
	label: __('Image & Gradient', 'blockera-core'),
};

const blockeraBackgroundColor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Background Color', 'blockera-core'),
};

const blockeraBackgroundClip: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Background Clipping', 'blockera-core'),
};

export const backgroundConfig = {
	blockeraBackground,
	blockeraBackgroundColor,
	blockeraBackgroundClip,
};
