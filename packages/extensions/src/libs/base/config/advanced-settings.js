// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraAttributes: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Custom HTML Attributes', 'blockera-core'),
	isActiveOnStates: ['normal'],
	isActiveOnBreakpoints: ['laptop'],
};

export const advancedSettingsConfig = {
	blockeraAttributes,
};
