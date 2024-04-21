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
	label: __('Custom CSS Code', 'blockera-core'),
	isActiveOnStates: ['normal'],
	isActiveOnBreakpoints: ['laptop'],
};

export const customStyleConfig = {
	blockeraCustomCSS,
};
