// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherFlexChildSizing: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Sizing', 'publisher-core'),
};

const publisherFlexChildAlign: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Align', 'publisher-core'),
};

const publisherFlexChildOrder: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Order', 'publisher-core'),
};

export const flexChildConfig = {
	publisherFlexChildSizing,
	publisherFlexChildAlign,
	publisherFlexChildOrder,
};
