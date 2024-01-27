// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherDisplay: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Display', 'publisher-core'),
};

const publisherFlexLayout: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Flex Layout', 'publisher-core'),
};

const publisherGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Gap', 'publisher-core'),
};

const publisherFlexWrap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Flex Wrap', 'publisher-core'),
};

const publisherAlignContent: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Align Content', 'publisher-core'),
};

export const layoutConfig = {
	publisherDisplay,
	publisherFlexLayout,
	publisherGap,
	publisherFlexWrap,
	publisherAlignContent,
};
