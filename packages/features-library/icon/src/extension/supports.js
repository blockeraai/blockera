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
	keywords: ['icon', 'svg', 'image'],
};

const blockeraIconPosition: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Position', 'blockera'),
	onStates: false,
	onBreakpoints: false,
	keywords: ['icon', 'position', 'alignment'],
};

const blockeraIconGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Gap', 'blockera'),
	keywords: ['icon', 'gap', 'spacing'],
};

const blockeraIconSize: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Size', 'blockera'),
	keywords: ['icon', 'size', 'font-size'],
	config: {
		attribute: 'blockeraIconSize',
	},
};

const blockeraIconColor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Icon Color', 'blockera'),
	keywords: ['icon', 'color', 'text-color'],
};

const blockeraIconRotate: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Icon Rotate', 'blockera'),
	keywords: ['icon', 'rotate', 'rotation'],
};

const blockeraIconFlipHorizontal: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Icon Flip Horizontal', 'blockera'),
	keywords: ['icon', 'flip', 'horizontal'],
};

const blockeraIconFlipVertical: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Icon Flip Vertical', 'blockera'),
	keywords: ['icon', 'flip', 'vertical'],
};

const blockeraIconLink: FeatureConfig = {
	show: true,
	force: true,
	status: false,
	label: __('Icon Link', 'blockera'),
	keywords: ['icon', 'link', 'url'],
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
