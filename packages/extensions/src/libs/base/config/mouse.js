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
	label: __('Cursor', 'blockera-core'),
};

const blockeraUserSelect: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('User Select', 'blockera-core'),
};

const blockeraPointerEvents: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Pointer Events', 'blockera-core'),
};

export const mouseConfig = {
	blockeraCursor,
	blockeraUserSelect,
	blockeraPointerEvents,
};
