// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherBackground: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Image & Gradient', 'publisher-core'),
};

const publisherBackgroundColor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Background Color', 'publisher-core'),
};

const publisherBackgroundClip: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Background Clipping', 'publisher-core'),
};

export const backgroundConfig = {
	publisherBackground,
	publisherBackgroundColor,
	publisherBackgroundClip,
};
