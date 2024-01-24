// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherWidth: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Width', 'publisher-core'),
};

const publisherHeight: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Height', 'publisher-core'),
};

const publisherMinWidth: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Min Width', 'publisher-core'),
};

const publisherMinHeight: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Min Height', 'publisher-core'),
};

const publisherMaxWidth: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Max Width', 'publisher-core'),
};

const publisherMaxHeight: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Max Height', 'publisher-core'),
};

const publisherOverflow: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Overflow', 'publisher-core'),
};

const publisherRatio: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Ratio', 'publisher-core'),
};

const publisherFit: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Fit', 'publisher-core'),
};

export const sizeConfig = {
	publisherWidth,
	publisherHeight,
	publisherMinWidth,
	publisherMinHeight,
	publisherMaxWidth,
	publisherMaxHeight,
	publisherOverflow,
	publisherRatio,
	publisherFit,
};
