// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherFontSize: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Font Size', 'publisher-core'),
};

const publisherLineHeight: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Line Height', 'publisher-core'),
};

const publisherFontColor: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Font Color', 'publisher-core'),
};

const publisherTextShadow: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Text Shadow', 'publisher-core'),
};

const publisherTextAlign: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Text Align', 'publisher-core'),
};

const publisherTextDecoration: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Text Decoration', 'publisher-core'),
};

const publisherFontStyle: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Font Style', 'publisher-core'),
};

const publisherTextTransform: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Text Transform', 'publisher-core'),
};

const publisherDirection: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Direction', 'publisher-core'),
};

const publisherLetterSpacing: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Letter Spacing', 'publisher-core'),
};

const publisherWordSpacing: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Word Spacing', 'publisher-core'),
};

const publisherTextIndent: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Text Indent', 'publisher-core'),
};

const publisherTextOrientation: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Text Orientation', 'publisher-core'),
};

const publisherTextColumns: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Text Columns', 'publisher-core'),
};

const publisherTextStroke: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Text Stroke', 'publisher-core'),
};

const publisherWordBreak: ConfigModel = {
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
