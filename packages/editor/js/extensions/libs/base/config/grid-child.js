// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraGridChildColumnSpan: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Column span', 'blockera'),
	keywords: ['grid', 'child', 'column', 'span', 'layout'],
};

const blockeraGridChildRowSpan: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Row span', 'blockera'),
	keywords: ['grid', 'child', 'row', 'span', 'layout'],
};

export const gridChildConfig = {
	status: true,
	initialOpen: true,
	blockeraGridChildColumnSpan,
	blockeraGridChildRowSpan,
};
