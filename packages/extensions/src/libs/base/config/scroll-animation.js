// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherScrollAnimation: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('On Scroll Animation', 'publisher-core'),
};

export const scrollAnimationConfig = {
	publisherScrollAnimation,
};
