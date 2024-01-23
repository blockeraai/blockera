// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { ConfigModel } from '../types';

const publisherClickAnimation: ConfigModel = {
	show: true,
	force: true,
	status: true,
	label: __('On Click Animation', 'publisher-core'),
};

export const clickAnimationConfig = {
	publisherClickAnimation,
};
