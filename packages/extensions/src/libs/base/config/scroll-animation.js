// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherScrollAnimation: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('On Scroll Animation', 'publisher-core'),
};

export const scrollAnimationConfig = {
	publisherScrollAnimation,
};
