// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../../base';

const publisherBackground: ConfigModel = {
	show: true,
	force: false,
	status: false,
	label: __('Background', 'publisher-core'),
};

export const heading = {
	publisherBackground,
};
