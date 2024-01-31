// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { FeatureConfig } from '../types';

const publisherFontSize: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Font Size', 'publisher-core'),
};

const publisherLineHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Line Height', 'publisher-core'),
};

const publisherFontColor: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Font Color', 'publisher-core'),
};

const publisherTextShadow: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Shadow', 'publisher-core'),
};

const publisherTextAlign: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Align', 'publisher-core'),
};

const publisherTextDecoration: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Decoration', 'publisher-core'),
};

const publisherFontStyle: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Font Style', 'publisher-core'),
};

const publisherTextTransform: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Transform', 'publisher-core'),
};

const publisherDirection: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Direction', 'publisher-core'),
};

const publisherLetterSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Letter Spacing', 'publisher-core'),
};

const publisherWordSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Word Spacing', 'publisher-core'),
};

const publisherTextIndent: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Indent', 'publisher-core'),
};

const publisherTextOrientation: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Orientation', 'publisher-core'),
};

const publisherTextColumns: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Columns', 'publisher-core'),
};

const publisherTextStroke: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Stroke', 'publisher-core'),
};

const publisherWordBreak: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Word Break', 'publisher-core'),
};

export const typographyConfig = {
	publisherFontSize,
	publisherLineHeight,
	publisherFontColor,
	publisherTextShadow,
	publisherTextAlign,
	publisherTextDecoration,
	publisherFontStyle,
	publisherTextTransform,
	publisherDirection,
	publisherLetterSpacing,
	publisherWordSpacing,
	publisherTextIndent,
	publisherTextOrientation,
	publisherTextColumns,
	publisherTextStroke,
	publisherWordBreak,
};
