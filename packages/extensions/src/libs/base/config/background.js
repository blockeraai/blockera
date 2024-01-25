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
	label: __('Image & Gradient', 'publisher-core'),
};

const publisherBackgroundColor: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Background Color', 'publisher-core'),
};

const publisherBackgroundClip: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Background Clipping', 'publisher-core'),
};

export const backgroundConfig = {
	publisherBackground,
	publisherBackgroundColor,
	publisherBackgroundClip,
};
