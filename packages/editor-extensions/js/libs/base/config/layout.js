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
};

const blockeraFlexLayout: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Flex Layout', 'blockera'),
};

const blockeraGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Gap', 'blockera'),
};

const blockeraFlexWrap: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Flex Children Wrap', 'blockera'),
};

const blockeraAlignContent: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	showInSettings: false,
	label: __('Children Align Content', 'blockera'),
};

const blockeraGridColumns: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Columns', 'blockera'),
};

const blockeraGridRows: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Rows', 'blockera'),
};

const blockeraGridGap: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Gap', 'blockera'),
};

const blockeraGridAreas: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Areas', 'blockera'),
};

const blockeraGridAlignItems: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Align Items', 'blockera'),
};

const blockeraGridJustifyItems: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Justify Items', 'blockera'),
};

const blockeraGridDirection: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Grid Direction', 'blockera'),
};

export const layoutConfig = {
	blockeraDisplay,
	blockeraFlexLayout,
	blockeraGap,
	blockeraFlexWrap,
	blockeraAlignContent,
	blockeraGridAlignItems,
	blockeraGridJustifyItems,
	//blockeraGridAlignContent,
	//blockeraGridJustifyContent,
	blockeraGridGap,
	blockeraGridDirection,
	blockeraGridColumns,
	blockeraGridRows,
	blockeraGridAreas,
};
