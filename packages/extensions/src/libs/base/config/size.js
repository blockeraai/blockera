// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherWidth: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Width', 'publisher-core'),
};

const publisherMinWidth: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Min Width', 'publisher-core'),
};

const publisherMaxWidth: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Max Width', 'publisher-core'),
};

const publisherHeight: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Height', 'publisher-core'),
};

const publisherMinHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Min Height', 'publisher-core'),
};

const publisherMaxHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Max Height', 'publisher-core'),
};

const publisherOverflow: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Overflow', 'publisher-core'),
};

const publisherRatio: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Aspect Ratio', 'publisher-core'),
};

const publisherFit: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Media Fit', 'publisher-core'),
};

export const sizeConfig = {
	publisherWidth,
	publisherMinWidth,
	publisherMaxWidth,
	publisherHeight,
	publisherMinHeight,
	publisherMaxHeight,
	publisherOverflow,
	publisherRatio,
	publisherFit,
};
