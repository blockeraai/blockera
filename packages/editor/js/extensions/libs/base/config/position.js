// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraPosition: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Position', 'blockera'),
	keywords: ['position', 'absolute', 'relative', 'fixed', 'sticky'],
};

const blockeraZIndex: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Z-Index', 'blockera'),
	keywords: ['z-index', 'zindex', 'layer', 'stack', 'order'],
};

export const positionConfig = {
	status: true,
	initialOpen: true,
	blockeraPosition,
	blockeraZIndex,
};
