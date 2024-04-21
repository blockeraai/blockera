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
	label: __('Font Size', 'blockera-core'),
};

const blockeraLineHeight: FeatureConfig = {
	show: false,
	force: false,
	status: true,
	label: __('Line Height', 'blockera-core'),
};

const blockeraFontColor: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Font Color', 'blockera-core'),
};

const blockeraTextShadow: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Shadow', 'blockera-core'),
};

const blockeraTextAlign: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Align', 'blockera-core'),
};

const blockeraTextDecoration: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Decoration', 'blockera-core'),
};

const blockeraFontStyle: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Font Style', 'blockera-core'),
};

const blockeraTextTransform: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Transform', 'blockera-core'),
};

const blockeraDirection: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Direction', 'blockera-core'),
};

const blockeraLetterSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Letter Spacing', 'blockera-core'),
};

const blockeraWordSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Word Spacing', 'blockera-core'),
};

const blockeraTextIndent: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Indent', 'blockera-core'),
};

const blockeraTextOrientation: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Orientation', 'blockera-core'),
};

const blockeraTextColumns: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Columns', 'blockera-core'),
};

const blockeraTextStroke: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Stroke', 'blockera-core'),
};

const blockeraWordBreak: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Word Break', 'blockera-core'),
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
