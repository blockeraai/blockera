// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraFontSize: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Font Size', 'blockera'),
};

const blockeraLineHeight: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Line Height', 'blockera'),
};

const blockeraFontColor: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	isActiveOnStatesOnFree: true,
	isActiveOnBreakpointsOnFree: true,
	isActiveOnInnerBlocksOnFree: true,
	label: __('Font Color', 'blockera'),
};

const blockeraTextShadow: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Shadow', 'blockera'),
};

const blockeraTextAlign: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Align', 'blockera'),
};

const blockeraTextDecoration: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Decoration', 'blockera'),
};

const blockeraFontStyle: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Font Style', 'blockera'),
};

const blockeraTextTransform: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Transform', 'blockera'),
};

const blockeraDirection: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Direction', 'blockera'),
};

const blockeraLetterSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Letter Spacing', 'blockera'),
};

const blockeraWordSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Word Spacing', 'blockera'),
};

const blockeraTextIndent: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Indent', 'blockera'),
};

const blockeraTextOrientation: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Orientation', 'blockera'),
};

const blockeraTextColumns: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Columns', 'blockera'),
};

const blockeraTextStroke: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Stroke', 'blockera'),
};

const blockeraWordBreak: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Word Break', 'blockera'),
};

export const typographyConfig = {
	blockeraFontSize,
	blockeraLineHeight,
	blockeraFontColor,
	blockeraTextShadow,
	blockeraTextAlign,
	blockeraTextDecoration,
	blockeraFontStyle,
	blockeraTextTransform,
	blockeraDirection,
	blockeraLetterSpacing,
	blockeraWordSpacing,
	blockeraTextIndent,
	blockeraTextOrientation,
	blockeraTextColumns,
	blockeraTextStroke,
	blockeraWordBreak,
};
