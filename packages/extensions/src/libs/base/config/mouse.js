// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherCursor: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Cursor', 'publisher-core'),
};

const publisherUserSelect: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('User Select', 'publisher-core'),
};

const publisherPointerEvents: ConfigModel = {
	show: true,
	force: false,
	status: true,
	label: __('Pointer Events', 'publisher-core'),
};

export const mouseConfig = {
	publisherCursor,
	publisherUserSelect,
	publisherPointerEvents,
};
