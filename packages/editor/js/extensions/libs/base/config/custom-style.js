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
	onNative: true,
	onStates: false,
	onInnerBlocks: false,
	onBreakpoints: false,
};

export const customStyleConfig = {
	initialOpen: false,
	blockeraCustomCSS,
};
