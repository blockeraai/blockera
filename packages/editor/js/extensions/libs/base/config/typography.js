// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const blockeraFontFamily: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Font Family', 'blockera'),
};

const blockeraFontAppearance: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Font Appearance', 'blockera'),
};

const blockeraFontSize: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Font Size', 'blockera'),
};

const blockeraLineHeight: FeatureConfig = {
	show: true,
	force: true,
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
	label: __('Text Color', 'blockera'),
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

const blockeraTextTransform: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Transform', 'blockera'),
};

const blockeraTextDecoration: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Decoration', 'blockera'),
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
	isActiveOnFree: false,
	label: __('Word Spacing', 'blockera'),
};

const blockeraTextIndent: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	isActiveOnFree: false,
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
	isActiveOnFree: false,
	label: __('Text Columns', 'blockera'),
};

const blockeraTextStroke: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	isActiveOnFree: false,
	label: __('Text Stroke', 'blockera'),
};

const blockeraWordBreak: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	isActiveOnFree: false,
	label: __('Word Break', 'blockera'),
};

const blockeraTextWrap: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	isActiveOnFree: false,
	label: __('Text Wrap', 'blockera'),
};

export const typographyConfig = {
	blockeraFontFamily,
	blockeraFontAppearance,
	blockeraFontSize,
	blockeraLineHeight,
	blockeraFontColor,
	blockeraTextShadow,
	blockeraTextAlign,
	blockeraTextDecoration,
	blockeraTextTransform,
	blockeraDirection,
	blockeraLetterSpacing,
	blockeraWordSpacing,
	blockeraTextIndent,
	blockeraTextOrientation,
	blockeraTextColumns,
	blockeraTextStroke,
	blockeraWordBreak,
	blockeraTextWrap,
};
