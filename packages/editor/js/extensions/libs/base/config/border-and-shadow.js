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
	label: __('Box Shadows', 'blockera'),
	keywords: ['shadow', 'box shadow', 'drop shadow', 'inset', 'outset'],
};

const blockeraOutline: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	cssGenerators: {},
	label: __('Outline', 'blockera'),
	onNative: true,
	keywords: ['outline', 'border', 'stroke'],
};

const blockeraBorder: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Border', 'blockera'),
	keywords: [
		'border',
		'stroke',
		'outline',
		'border top',
		'border bottom',
		'border left',
		'border right',
		'border color',
		'border style',
		'border width',
	],
};

const blockeraBorderRadius: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Border Radius', 'blockera'),
	keywords: ['border', 'radius', 'rounded', 'corner'],
};

export const borderAndShadowConfig = {
	status: true,
	initialOpen: true,
	blockeraBorder,
	blockeraBorderRadius,
	blockeraBoxShadow,
	blockeraOutline,
};
