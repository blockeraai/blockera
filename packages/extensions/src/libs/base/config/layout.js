// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherDisplay: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Display', 'publisher-core'),
};

const publisherFlexLayout: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Flex Layout', 'publisher-core'),
};

const publisherGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Gap', 'publisher-core'),
};

const publisherFlexWrap: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Flex Children Wrap', 'publisher-core'),
};

const publisherAlignContent: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	showInSettings: false,
	label: __('Children Align Content', 'publisher-core'),
};

const publisherGridColumns: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Columns', 'publisher-core'),
};

const publisherGridRows: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Rows', 'publisher-core'),
};

const publisherGridGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Gap', 'publisher-core'),
};

const publisherGridAreas: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Areas', 'publisher-core'),
};

const publisherGridAlignItems: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Align Items', 'publisher-core'),
};

const publisherGridJustifyItems: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Justify Items', 'publisher-core'),
};

const publisherGridDirection: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Direction', 'publisher-core'),
};

export const layoutConfig = {
	publisherDisplay,
	publisherFlexLayout,
	publisherGap,
	publisherFlexWrap,
	publisherAlignContent,
	publisherGridAlignItems,
	publisherGridJustifyItems,
	//publisherGridAlignContent: true,
	//publisherGridJustifyContent: true,
	publisherGridGap,
	publisherGridDirection,
	publisherGridColumns,
	publisherGridRows,
	publisherGridAreas,
};
