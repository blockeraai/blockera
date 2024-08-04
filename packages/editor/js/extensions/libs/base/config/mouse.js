// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraCursor: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Cursor', 'blockera'),
};

const blockeraUserSelect: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('User Select', 'blockera'),
};

const blockeraPointerEvents: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Pointer Events', 'blockera'),
};

export const mouseConfig = {
	blockeraCursor,
	blockeraUserSelect,
	blockeraPointerEvents,
};
