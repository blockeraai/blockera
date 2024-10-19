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
	isActiveOnFree: false,
};

const blockeraUserSelect: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('User Select', 'blockera'),
	isActiveOnFree: false,
};

const blockeraPointerEvents: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Pointer Events', 'blockera'),
	isActiveOnFree: false,
};

export const mouseConfig = {
	blockeraCursor,
	blockeraUserSelect,
	blockeraPointerEvents,
};
