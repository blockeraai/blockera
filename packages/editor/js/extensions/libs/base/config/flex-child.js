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
	isActiveOnFree: false,
};

const blockeraFlexChildAlign: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Align', 'blockera'),
	isActiveOnFree: false,
};

const blockeraFlexChildOrder: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Order', 'blockera'),
	isActiveOnFree: false,
};

export const flexChildConfig = {
	initialOpen: true,
	blockeraFlexChildSizing,
	blockeraFlexChildAlign,
	blockeraFlexChildOrder,
};
