/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

export const backgroundConfig = {
	publisherBackground: {
		status: true, //
		label: __('Background', 'publisher-core'),
		show: true, // if true show on settings
		force: true, // if true by default show
	},
	publisherBackgroundColor: true,
	publisherBackgroundClip: true,
};
