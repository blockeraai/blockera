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
	keywords: ['width', 'size', 'dimension'],
};

const blockeraMinWidth: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Min Width', 'blockera'),
	keywords: ['min', 'width', 'minimum', 'size'],
};

const blockeraMaxWidth: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Max Width', 'blockera'),
	keywords: ['max', 'width', 'maximum', 'size'],
};

const blockeraHeight: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Height', 'blockera'),
	keywords: ['height', 'size', 'dimension'],
};

const blockeraMinHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Min Height', 'blockera'),
	keywords: ['min', 'height', 'minimum', 'size'],
};

const blockeraMaxHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Max Height', 'blockera'),
	keywords: ['max', 'height', 'maximum', 'size'],
};

const blockeraOverflow: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Overflow', 'blockera'),
	keywords: ['overflow', 'scroll', 'hidden', 'auto'],
};

const blockeraRatio: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Aspect Ratio', 'blockera'),
	keywords: ['aspect', 'ratio', '16:9', '4:3'],
};

const blockeraFit: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Media Fit', 'blockera'),
	keywords: ['fit', 'media', 'object-fit', 'cover', 'contain'],
};

const blockeraBoxSizing: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Box Sizing', 'blockera'),
	keywords: ['box', 'sizing', 'border box', 'content box', 'size'],
};

export const sizeConfig = {
	status: true,
	initialOpen: true,
	blockeraWidth,
	blockeraMinWidth,
	blockeraMaxWidth,
	blockeraHeight,
	blockeraMinHeight,
	blockeraMaxHeight,
	blockeraOverflow,
	blockeraRatio,
	blockeraFit,
	blockeraBoxSizing,
};
