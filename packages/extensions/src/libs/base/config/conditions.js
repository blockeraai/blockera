// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherConditions: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('Conditions', 'publisher-core'),
};

export const conditionsConfig = {
	publisherConditions,
};
