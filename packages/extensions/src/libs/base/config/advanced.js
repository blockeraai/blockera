// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherCustomCSS: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Custom CSS Code', 'publisher-core'),
	isActiveOnStates: ['normal'],
	isActiveOnBreakpoints: ['laptop'],
};

export const advancedConfig = {
	publisherCustomCSS,
};
