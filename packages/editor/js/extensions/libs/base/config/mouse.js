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
	onNative: true,
};

const blockeraUserSelect: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('User Select', 'blockera'),
	onNative: true,
};

const blockeraPointerEvents: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Pointer Events', 'blockera'),
	onNative: true,
};

export const mouseConfig = {
	initialOpen: true,
	blockeraCursor,
	blockeraUserSelect,
	blockeraPointerEvents,
};
