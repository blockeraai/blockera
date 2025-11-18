// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../../base';

const contentField: FeatureConfig = {
	status: true,
	show: true,
	force: true,
	label: __('Content', 'blockera'),
};

export const statesConfig = {
	initialOpen: true,
	contentField,
};
