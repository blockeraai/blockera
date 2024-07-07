// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';
import { getBaseBreakpoint } from '../../../../canvas-editor/components/breakpoints/helpers';

const blockeraAttributes: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Custom HTML Attributes', 'blockera'),
	isActiveOnStates: ['normal'],
	isActiveOnBreakpoints: [getBaseBreakpoint()],
};

export const advancedSettingsConfig = {
	blockeraAttributes,
};
