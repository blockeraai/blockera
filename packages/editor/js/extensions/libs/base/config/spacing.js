// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraSpacing: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Spacing', 'blockera'),
	keywords: ['spacing', 'margin', 'padding', 'gap'],
};

export const spacingConfig = {
	status: true,
	initialOpen: true,
	blockeraSpacing,
};
