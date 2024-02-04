// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../../base';

const publisherBackground: FeatureConfig = {
	show: true,
	force: false,
	status: false,
	label: __('Background', 'publisher-core'),
};
const publisherBackgroundClip: FeatureConfig = {
	show: true,
	force: false,
	status: false,
	label: __('Background Clip', 'publisher-core'),
};
const publisherBackgroundColor: FeatureConfig = {
	show: true,
	force: false,
	status: false,
	label: __('Background Color', 'publisher-core'),
};

export const heading = {
	publisherBackground,
	publisherBackgroundClip,
	publisherBackgroundColor,
};
