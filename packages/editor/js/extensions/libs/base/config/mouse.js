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
	onNative: true,
	onCompanion: true,
	label: __('Cursor', 'blockera'),
	keywords: ['cursor', 'pointer', 'mouse', 'hover'],
};

const blockeraUserSelect: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onNative: true,
	onCompanion: true,
	label: __('User Select', 'blockera'),
	keywords: ['select', 'user-select', 'text', 'selection'],
};

const blockeraPointerEvents: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onNative: true,
	onCompanion: true,
	label: __('Pointer Events', 'blockera'),
	keywords: ['pointer', 'events', 'click', 'interaction'],
};

export const mouseConfig = {
	status: true,
	initialOpen: true,
	blockeraCursor,
	blockeraUserSelect,
	blockeraPointerEvents,
};
