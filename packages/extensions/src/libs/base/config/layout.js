// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherDisplay: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Display', 'publisher-core'),
};

const publisherFlexLayout: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Flex Layout', 'publisher-core'),
};

const publisherGap: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Gap', 'publisher-core'),
};

const publisherFlexWrap: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Flex Wrap', 'publisher-core'),
};

const publisherAlignContent: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Align Content', 'publisher-core'),
};

export const layoutConfig = {
	publisherDisplay,
	publisherFlexLayout,
	publisherGap,
	publisherFlexWrap,
	publisherAlignContent,
	publisherGridAlignItems: true,
	publisherGridJustifyItems: true,
	publisherGridAlignContent: true,
	publisherGridJustifyContent: true,
	publisherGridGap: true,
	publisherGridDirection: true,
	publisherGridColumns: true,
	publisherGridRows: true,
	publisherGridAreas: true,
};
