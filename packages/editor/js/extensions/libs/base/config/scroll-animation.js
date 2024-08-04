// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraScrollAnimation: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('On Scroll Animation', 'blockera'),
};

export const scrollAnimationConfig = {
	blockeraScrollAnimation,
};
