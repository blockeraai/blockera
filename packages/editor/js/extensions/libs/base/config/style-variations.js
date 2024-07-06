// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraStyleVariation: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Style Variation', 'blockera'),
	isActiveOnStates: ['normal'],
	isActiveOnBreakpoints: ['laptop'],
};

export const styleVariationsConfig = {
	blockeraStyleVariation,
};
