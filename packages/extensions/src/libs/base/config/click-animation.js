// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherClickAnimation: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('On Click Animation', 'publisher-core'),
};

export const clickAnimationConfig = {
	publisherClickAnimation,
};
