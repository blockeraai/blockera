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
	keywords: ['cursor', 'pointer', 'mouse', 'hover'],
};

const blockeraUserSelect: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('User Select', 'blockera'),
	onNative: true,
	keywords: ['select', 'user-select', 'text', 'selection'],
};

const blockeraPointerEvents: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Pointer Events', 'blockera'),
	onNative: true,
	keywords: ['pointer', 'events', 'click', 'interaction'],
};

export const mouseConfig = {
	status: true,
	initialOpen: true,
	blockeraCursor,
	blockeraUserSelect,
	blockeraPointerEvents,
};
