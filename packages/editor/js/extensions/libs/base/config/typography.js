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
	keywords: ['font', 'family', 'typeface', 'typography', 'text'],
};

const blockeraFontAppearance: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Font Appearance', 'blockera'),
	keywords: ['font', 'appearance', 'weight', 'style', 'bold', 'italic'],
};

const blockeraFontSize: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Font Size', 'blockera'),
	keywords: ['font', 'size', 'text', 'typography'],
};

const blockeraLineHeight: FeatureConfig = {
	show: true,
	force: true,
	status: true,
	label: __('Line Height', 'blockera'),
	keywords: ['line', 'height', 'leading', 'spacing', 'typography'],
};

const blockeraFontColor: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onNativeOnInnerBlocks: false,
	label: __('Text Color', 'blockera'),
	keywords: ['text', 'color', 'font', 'color', 'text color', 'font color'],
};

const blockeraTextShadow: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Shadow', 'blockera'),
	keywords: ['text', 'shadow', 'drop shadow', 'typography'],
};

const blockeraTextAlign: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Align', 'blockera'),
	keywords: [
		'text',
		'align',
		'alignment',
		'left',
		'center',
		'right',
		'justify',
	],
};

const blockeraTextTransform: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Transform', 'blockera'),
	keywords: ['text', 'transform', 'uppercase', 'lowercase', 'capitalize'],
};

const blockeraTextDecoration: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Decoration', 'blockera'),
	keywords: ['text', 'decoration', 'underline', 'line-through', 'none'],
};

const blockeraDirection: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Direction', 'blockera'),
	keywords: ['direction', 'rtl', 'ltr', 'text direction'],
};

const blockeraLetterSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Letter Spacing', 'blockera'),
	keywords: ['letter', 'spacing', 'tracking', 'kerning', 'typography'],
};

const blockeraWordSpacing: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onNative: true,
	label: __('Word Spacing', 'blockera'),
	keywords: ['word', 'spacing', 'typography'],
};

const blockeraTextIndent: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onNative: true,
	label: __('Text Indent', 'blockera'),
	keywords: ['text', 'indent', 'indentation', 'paragraph'],
};

const blockeraTextOrientation: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	label: __('Text Orientation', 'blockera'),
	keywords: ['text', 'orientation', 'vertical', 'upright', 'sideways'],
};

const blockeraTextColumns: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onNative: true,
	label: __('Text Columns', 'blockera'),
	keywords: ['text', 'columns', 'column', 'multi-column'],
};

const blockeraTextStroke: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onNative: true,
	label: __('Text Stroke', 'blockera'),
};

const blockeraWordBreak: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onNative: true,
	label: __('Word Break', 'blockera'),
	keywords: ['word', 'break', 'wrap', 'overflow'],
};

const blockeraTextWrap: FeatureConfig = {
	show: true,
	force: false,
	status: true,
	onNative: true,
	label: __('Text Wrap', 'blockera'),
	keywords: ['text', 'wrap', 'word', 'break', 'overflow'],
};

export const typographyConfig = {
	status: true,
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
	blockeraTextWrap,
	blockeraWordBreak,
};
