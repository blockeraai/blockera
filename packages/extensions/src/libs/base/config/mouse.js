// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherCursor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Cursor', 'publisher-core'),
};

const publisherUserSelect: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('User Select', 'publisher-core'),
};

const publisherPointerEvents: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Pointer Events', 'publisher-core'),
};

export const mouseConfig = {
	publisherCursor,
	publisherUserSelect,
	publisherPointerEvents,
};
