// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherSpacing: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Spacing', 'publisher-core'),
};

export const spacingConfig = {
	publisherSpacing,
};
