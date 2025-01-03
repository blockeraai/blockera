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
};

export const spacingConfig = {
	initialOpen: true,
	blockeraSpacing,
};
