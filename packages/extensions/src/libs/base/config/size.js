// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraWidth: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Width', 'blockera'),
};

const blockeraMinWidth: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Min Width', 'blockera'),
};

const blockeraMaxWidth: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Max Width', 'blockera'),
};

const blockeraHeight: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Height', 'blockera'),
};

const blockeraMinHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Min Height', 'blockera'),
};

const blockeraMaxHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Max Height', 'blockera'),
};

const blockeraOverflow: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Overflow', 'blockera'),
};

const blockeraRatio: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Aspect Ratio', 'blockera'),
};

const blockeraFit: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Media Fit', 'blockera'),
};

export const sizeConfig = {
	blockeraWidth,
	blockeraMinWidth,
	blockeraMaxWidth,
	blockeraHeight,
	blockeraMinHeight,
	blockeraMaxHeight,
	blockeraOverflow,
	blockeraRatio,
	blockeraFit,
};
