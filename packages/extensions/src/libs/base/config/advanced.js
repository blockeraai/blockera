// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherAttributes: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Attributes', 'publisher-core'),
};

const publisherCSSProperties: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('CSS Properties', 'publisher-core'),
};

export const advancedConfig = {
	publisherAttributes,
	publisherCSSProperties,
};
