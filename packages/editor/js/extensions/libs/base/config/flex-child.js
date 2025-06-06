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
	onNative: true,
};

const blockeraFlexChildAlign: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Align', 'blockera'),
	onNative: true,
};

const blockeraFlexChildOrder: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Order', 'blockera'),
	onNative: true,
};

export const flexChildConfig = {
	initialOpen: true,
	blockeraFlexChildSizing,
	blockeraFlexChildAlign,
	blockeraFlexChildOrder,
};
