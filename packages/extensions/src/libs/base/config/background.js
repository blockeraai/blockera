// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherBackground: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Background', 'publisher-core'),
};

const publisherBackgroundColor: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Background Color', 'publisher-core'),
};

const publisherBackgroundClip: ConfigModel = {
	show: false,
	force: true,
	status: true,
	label: __('Background Clip', 'publisher-core'),
};

export const backgroundConfig = {
	publisherBackground,
	publisherBackgroundColor,
	publisherBackgroundClip,
};
