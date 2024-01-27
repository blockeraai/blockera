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

const publisherHeight: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Height', 'publisher-core'),
};

const publisherMinWidth: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Min Width', 'publisher-core'),
};

const publisherMinHeight: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Min Height', 'publisher-core'),
};

const publisherMaxWidth: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Max Width', 'publisher-core'),
};

const publisherMaxHeight: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Max Height', 'publisher-core'),
};

const publisherOverflow: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Overflow', 'publisher-core'),
};

const publisherRatio: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Ratio', 'publisher-core'),
};

const publisherFit: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Fit', 'publisher-core'),
};

export const sizeConfig = {
	publisherWidth,
	publisherHeight,
	publisherMinWidth,
	publisherMinHeight,
	publisherMaxWidth,
	publisherMaxHeight,
	publisherOverflow,
	publisherRatio,
	publisherFit,
};
