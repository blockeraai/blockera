// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherCSSProperties: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('CSS Properties', 'publisher-core'),
};

export const advancedConfig = {
	publisherCSSProperties,
};
