// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraGridChildOrder: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Order', 'blockera'),
};

const blockeraGridChildLayout: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Self Layout', 'blockera'),
};

export const gridChildConfig = {
	blockeraGridChildOrder,
	blockeraGridChildLayout,
};
