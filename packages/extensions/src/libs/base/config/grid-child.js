// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherGridChildOrder: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Order', 'publisher-core'),
};

const publisherGridChildLayout: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Self Layout', 'publisher-core'),
};

export const gridChildConfig = {
	publisherGridChildOrder,
	publisherGridChildLayout,
};
