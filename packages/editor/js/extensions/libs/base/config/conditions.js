// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraConditions: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Conditions', 'blockera'),
};

export const conditionsConfig = {
	initialOpen: true,
	blockeraConditions,
};
