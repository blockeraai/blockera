// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '@blockera/editor/js/extensions/libs/base/types';

const blockeraIcon: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon', 'blockera'),
	onStates: false,
	onBreakpoints: false,
};

const blockeraIconPosition: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Position', 'blockera'),
	onStates: false,
	onBreakpoints: false,
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

const blockeraIconRotate: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Icon Rotate', 'blockera'),
};

const blockeraIconFlipHorizontal: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Icon Flip Horizontal', 'blockera'),
};

const blockeraIconFlipVertical: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Icon Flip Vertical', 'blockera'),
};

const blockeraIconLink: FeatureConfig = {
	show: true,
	force: true,
	status: false,
	label: __('Icon Link', 'blockera'),
};

export const iconConfig = {
	initialOpen: true,
	blockeraIcon,
	blockeraIconPosition,
	blockeraIconGap,
	blockeraIconSize,
	blockeraIconColor,
	blockeraIconLink,
	blockeraIconRotate,
	blockeraIconFlipHorizontal,
	blockeraIconFlipVertical,
};
