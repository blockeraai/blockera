// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraDisplay: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Display', 'blockera'),
	keywords: ['display', 'flex', 'grid', 'block', 'inline'],
};

const blockeraFlexLayout: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Flex Layout', 'blockera'),
	keywords: ['flex', 'layout', 'flexbox', 'direction', 'justify', 'align'],
};

const blockeraGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Gap', 'blockera'),
	keywords: ['gap', 'spacing', 'flex', 'grid'],
};

const blockeraFlexWrap: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Flex Children Wrap', 'blockera'),
	keywords: ['flex', 'wrap', 'nowrap', 'children'],
};

const blockeraSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Padding & Margin', 'blockera'),
	keywords: ['padding', 'margin', 'spacing', 'gap'],
};

export const layoutConfig = {
	status: true,
	initialOpen: true,
	blockeraDisplay,
	blockeraFlexLayout,
	blockeraGap,
	blockeraFlexWrap,
	blockeraSpacing,
};
