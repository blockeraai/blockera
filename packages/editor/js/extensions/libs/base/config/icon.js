// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraIcon: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon', 'blockera'),
};

const blockeraIconOptions: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Options', 'blockera'),
};

const blockeraIconPosition: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Position', 'blockera'),
};

const blockeraIconGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Gap', 'blockera'),
};

const blockeraIconSize: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Size', 'blockera'),
};

const blockeraIconColor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Color', 'blockera'),
};

const blockeraIconLink: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Link', 'blockera'),
};

export const iconConfig = {
	blockeraIcon,
	blockeraIconOptions,
	blockeraIconPosition,
	blockeraIconGap,
	blockeraIconSize,
	blockeraIconColor,
	blockeraIconLink,
};
