// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherStyleVariation: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Style Variation', 'publisher-core'),
};

export const styleVariationsConfig = {
	publisherStyleVariation,
};
