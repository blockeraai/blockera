// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';
import { getBaseBreakpoint } from '../../../../editor/header-ui';

const blockeraAttributes: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Custom HTML Attributes', 'blockera'),
	onNative: true,
	onStates: ['normal'],
	onBreakpoints: [getBaseBreakpoint()],
	onInnerBlocks: false,
};

export const advancedSettingsConfig = {
	status: true,
	initialOpen: true,
	blockeraAttributes,
};
