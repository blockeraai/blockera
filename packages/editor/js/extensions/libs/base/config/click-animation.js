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
	label: __('On Click Animation', 'blockera'),
	keywords: ['click', 'animation', 'interaction', 'hover', 'effect'],
};

export const clickAnimationConfig = {
	status: true,
	initialOpen: true,
	blockeraClickAnimation,
};
