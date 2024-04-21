// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraEntranceAnimation: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('On Entrance', 'blockera-core'),
};

export const entranceAnimationConfig = {
	blockeraEntranceAnimation,
};
