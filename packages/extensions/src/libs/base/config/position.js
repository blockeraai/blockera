// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherPosition: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Position', 'publisher-core'),
};

const publisherZIndex: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Z-Index', 'publisher-core'),
};

export const positionConfig = {
	publisherPosition,
	publisherZIndex,
};
