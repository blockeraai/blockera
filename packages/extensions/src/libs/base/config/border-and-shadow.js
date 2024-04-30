// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraBoxShadow: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	cssGenerators: {},
	label: __('Box Shadow', 'blockera'),
};

const blockeraOutline: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	cssGenerators: {},
	label: __('Outline', 'blockera'),
};

const blockeraBorder: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Border', 'blockera'),
};

const blockeraBorderRadius: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	cssGenerators: {},
	label: __('Border Radius', 'blockera'),
};

export const borderAndShadowConfig = {
	blockeraBorder,
	blockeraBorderRadius,
	blockeraBoxShadow,
	blockeraOutline,
};
