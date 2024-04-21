// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraClickAnimation: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('On Click Animation', 'blockera-core'),
};

export const clickAnimationConfig = {
	blockeraClickAnimation,
};
