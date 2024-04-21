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
	label: __('Icon', 'blockera-core'),
};

const blockeraIconOptions: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Options', 'blockera-core'),
};

const blockeraIconPosition: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Position', 'blockera-core'),
};

const blockeraIconGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Gap', 'blockera-core'),
};

const blockeraIconSize: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Size', 'blockera-core'),
};

const blockeraIconColor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Color', 'blockera-core'),
};

const blockeraIconLink: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Link', 'blockera-core'),
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
