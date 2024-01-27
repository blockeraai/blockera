// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherCSSProperties: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('CSS Properties', 'publisher-core'),
};

export const advancedConfig = {
	publisherCSSProperties,
};
