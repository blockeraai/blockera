// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherBoxShadow: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Box Shadow', 'publisher-core'),
};

const publisherOutline: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Outline', 'publisher-core'),
};

const publisherBorder: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Border', 'publisher-core'),
};

const publisherBorderRadius: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Border Radius', 'publisher-core'),
};

export const borderAndShadowConfig = {
	publisherBoxShadow,
	publisherOutline,
	publisherBorder,
	publisherBorderRadius,
};
