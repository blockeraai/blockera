// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherSpacing: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Spacing', 'publisher-core'),
};

export const spacingConfig = {
	publisherSpacing,
};
