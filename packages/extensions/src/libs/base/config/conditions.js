// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherConditions: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Conditions', 'publisher-core'),
};

export const conditionsConfig = {
	publisherConditions,
};
