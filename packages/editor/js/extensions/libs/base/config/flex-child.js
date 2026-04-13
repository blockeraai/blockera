// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraFlexChildSizing: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Sizing', 'blockera'),
	onNative: true,
	keywords: ['flex', 'child', 'sizing', 'grow', 'shrink', 'basis'],
};

const blockeraFlexChildAlign: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Align', 'blockera'),
	onNative: true,
	keywords: ['flex', 'child', 'align', 'alignment', 'self'],
};

const blockeraFlexChildOrder: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Order', 'blockera'),
	onNative: true,
	keywords: ['flex', 'child', 'order', 'sequence', 'z-index'],
};

export const flexChildConfig = {
	status: true,
	initialOpen: true,
	blockeraFlexChildSizing,
	blockeraFlexChildAlign,
	blockeraFlexChildOrder,
};
