// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherIcon: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Icon', 'publisher-core'),
};

const publisherIconOptions: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Options', 'publisher-core'),
};

const publisherIconPosition: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Position', 'publisher-core'),
};

const publisherIconGap: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Gap', 'publisher-core'),
};

const publisherIconSize: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Size', 'publisher-core'),
};

const publisherIconColor: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Color', 'publisher-core'),
};

const publisherIconLink: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Link', 'publisher-core'),
};

export const iconConfig = {
	publisherIcon,
	publisherIconOptions,
	publisherIconPosition,
	publisherIconGap,
	publisherIconSize,
	publisherIconColor,
	publisherIconLink,
};
