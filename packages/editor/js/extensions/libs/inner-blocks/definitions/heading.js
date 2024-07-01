// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../../base';

const blockeraBackground: FeatureConfig = {
	show: true,
	force: false,
	status: false,
	label: __('Background', 'blockera'),
};
const blockeraBackgroundClip: FeatureConfig = {
	show: true,
	force: false,
	status: false,
	label: __('Background Clip', 'blockera'),
};
const blockeraBackgroundColor: FeatureConfig = {
	show: true,
	force: false,
	status: false,
	label: __('Background Color', 'blockera'),
};

export const heading = {
	blockeraBackground,
	blockeraBackgroundClip,
	blockeraBackgroundColor,
};
