// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraFlexChildSizing: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Sizing', 'blockera'),
};

const blockeraFlexChildAlign: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Align', 'blockera'),
};

const blockeraFlexChildOrder: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Order', 'blockera'),
};

export const flexChildConfig = {
	blockeraFlexChildSizing,
	blockeraFlexChildAlign,
	blockeraFlexChildOrder,
};
