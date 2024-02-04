// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherEntranceAnimation: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('On Entrance', 'publisher-core'),
};

export const entranceAnimationConfig = {
	publisherEntranceAnimation,
};
