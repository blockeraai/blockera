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
	label: __('Width', 'blockera-core'),
};

const blockeraMinWidth: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Min Width', 'blockera-core'),
};

const blockeraMaxWidth: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Max Width', 'blockera-core'),
};

const blockeraHeight: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Height', 'blockera-core'),
};

const blockeraMinHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Min Height', 'blockera-core'),
};

const blockeraMaxHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Max Height', 'blockera-core'),
};

const blockeraOverflow: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Overflow', 'blockera-core'),
};

const blockeraRatio: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Aspect Ratio', 'blockera-core'),
};

const blockeraFit: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Media Fit', 'blockera-core'),
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
