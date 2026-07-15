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
	show: true,
	force: false,
	status: true,
	onCompanion: true,
	label: __('Flex Children Wrap', 'blockera'),
	keywords: ['flex', 'wrap', 'nowrap', 'children'],
};

const blockeraAlignContent: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onCompanion: true,
	label: __('Align Content', 'blockera'),
	keywords: ['align-content', 'flex', 'wrap', 'align', 'content', 'stretch'],
};

const blockeraSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Padding & Margin', 'blockera'),
	keywords: [
		'padding',
		'margin',
		'spacing',
		'gap',
		'top',
		'bottom',
		'left',
		'right',
	],
};

const blockeraGridMinimumColumnWidth: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Min. column width', 'blockera'),
	keywords: ['grid', 'columns', 'width', 'minimum', 'layout'],
};

const blockeraGridColumnCount: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Columns', 'blockera'),
	keywords: ['grid', 'columns', 'count', 'layout'],
};

export const layoutConfig = {
	status: true,
	initialOpen: true,
	blockeraDisplay,
	blockeraFlexLayout,
	blockeraGap,
	blockeraFlexWrap,
	blockeraAlignContent,
	blockeraSpacing,
	blockeraGridMinimumColumnWidth,
	blockeraGridColumnCount,
};
