// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../../base';

const publisherBackground: ConfigModel = {
	show: true,
	force: false,
	status: false,
	label: __('Background', 'publisher-core'),
};
const publisherBackgroundClip: ConfigModel = {
	show: true,
	force: false,
	status: false,
	label: __('Background Clip', 'publisher-core'),
};
const publisherBackgroundColor: ConfigModel = {
	show: true,
	force: false,
	status: false,
	label: __('Background Color', 'publisher-core'),
};

export const heading = {
	publisherBackground,
	publisherBackgroundClip,
	publisherBackgroundColor,
};
