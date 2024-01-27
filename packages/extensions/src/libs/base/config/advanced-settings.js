// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherAttributes: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('HTML Attributes', 'publisher-core'),
};

export const advancedSettingsConfig = {
	publisherAttributes,
};
