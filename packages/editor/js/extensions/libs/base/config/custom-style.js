// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraCustomCSS: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Custom CSS Code', 'blockera'),
	onStates: false,
	onInnerBlocks: false,
	onBreakpoints: false,
	keywords: ['css', 'custom', 'code', 'style', 'stylesheet'],
};

export const customStyleConfig = {
	status: true,
	initialOpen: false,
	blockeraCustomCSS,
};
