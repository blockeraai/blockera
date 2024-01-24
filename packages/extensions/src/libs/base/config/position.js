// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherPosition: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Position', 'publisher-core'),
};

const publisherZIndex: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Z-Index', 'publisher-core'),
};

export const positionConfig = {
	publisherPosition,
	publisherZIndex,
};
