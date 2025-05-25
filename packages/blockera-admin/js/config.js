// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

export const config: Object = {
	general: {
		restrictBlockVisibility: {
			status: true,
			label: __(
				'Restrict block visibility controls to selected user roles.',
				'blockera'
			),
			onNative: true,
			config: {
				userRole: {
					label: '',
					status: true,
					onNative: true,
					isParentActive: false,
					parent: 'Restrict Block Visibility',
				},
			},
		},
		restrictBlockVisibilityByPostType: {
			status: true,
			label: __(
				'Restrict block visibility controls to selected post types.',
				'blockera'
			),
			onNative: true,
			config: {
				postType: {
					label: '',
					status: true,
					onNative: true,
					isParentActive: false,
					parent: 'Restrict Block Visibility By Post Type',
				},
			},
		},
	},
};
