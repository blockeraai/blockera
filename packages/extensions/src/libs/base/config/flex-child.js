// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherFlexChildSizing: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Sizing', 'publisher-core'),
};

const publisherFlexChildAlign: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Align', 'publisher-core'),
};

const publisherFlexChildOrder: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Order', 'publisher-core'),
};

export const flexChildConfig = {
	publisherFlexChildSizing,
	publisherFlexChildAlign,
	publisherFlexChildOrder,
};
