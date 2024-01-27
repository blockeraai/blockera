// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherIcon: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon', 'publisher-core'),
};

const publisherIconOptions: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Options', 'publisher-core'),
};

const publisherIconPosition: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Position', 'publisher-core'),
};

const publisherIconGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Gap', 'publisher-core'),
};

const publisherIconSize: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Size', 'publisher-core'),
};

const publisherIconColor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Color', 'publisher-core'),
};

const publisherIconLink: FeatureConfig = {
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
