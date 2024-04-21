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
	label: __('Position', 'blockera-core'),
};

const blockeraZIndex: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Z-Index', 'blockera-core'),
};

export const positionConfig = {
	blockeraPosition,
	blockeraZIndex,
};
