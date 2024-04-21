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
	label: __('Box Shadow', 'blockera-core'),
};

const blockeraOutline: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	cssGenerators: {},
	label: __('Outline', 'blockera-core'),
};

const blockeraBorder: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	cssGenerators: {},
	label: __('Border', 'blockera-core'),
};

const blockeraBorderRadius: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	cssGenerators: {},
	label: __('Border Radius', 'blockera-core'),
};

export const borderAndShadowConfig = {
	blockeraBorder,
	blockeraBorderRadius,
	blockeraBoxShadow,
	blockeraOutline,
};
